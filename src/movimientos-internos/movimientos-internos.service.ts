import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MovimientosInternosUpdateDTO } from './dto/movimientos-internos-update.dto';
import { MovimientosInternosDTO } from './dto/movimientos-internos.dto';
import { IMovimientosInternos } from './interface/movimientos-internos.interface';
import { IUsuario } from 'src/usuarios/interface/usuarios.interface';
import { ICajas } from 'src/cajas/interface/cajas.interface';

@Injectable()
export class MovimientosInternosService {

  constructor(
    @InjectModel('MovimientosInternos') private readonly movimientosInternosModel: Model<IMovimientosInternos>,
    @InjectModel('Cajas') private readonly cajasModel: Model<ICajas>,
    @InjectModel('Usuarios') private readonly usuarioModel: Model<IUsuario>,
  ) { };

  // Movimientos internos por ID
  async getId(id: string): Promise<IMovimientosInternos> {

    // Se verifica si el movimiento existe
    const movimientoDB = await this.movimientosInternosModel.findById(id);
    if (!movimientoDB) throw new NotFoundException('El movimiento no existe');

    const pipeline = [];

    // Movimiento por ID
    const idMovimiento = new Types.ObjectId(id);
    pipeline.push({ $match: { _id: idMovimiento } })

    // Informacion de caja origen
    pipeline.push({
      $lookup: { // Lookup
        from: 'cajas',
        localField: 'caja_origen',
        foreignField: '_id',
        as: 'caja_origen'
      }
    }
    );

    pipeline.push({ $unwind: '$caja_origen' });

    // Informacion de caja destino
    pipeline.push({
      $lookup: { // Lookup
        from: 'cajas',
        localField: 'caja_destino',
        foreignField: '_id',
        as: 'caja_destino'
      }
    }
    );

    pipeline.push({ $unwind: '$caja_destino' });

    // Informacion de usuario creador
    pipeline.push({
      $lookup: { // Lookup
        from: 'usuarios',
        localField: 'creatorUser',
        foreignField: '_id',
        as: 'creatorUser'
      }
    }
    );

    pipeline.push({ $unwind: '$creatorUser' });

    // Informacion de usuario actualizador
    pipeline.push({
      $lookup: { // Lookup
        from: 'usuarios',
        localField: 'updatorUser',
        foreignField: '_id',
        as: 'updatorUser'
      }
    }
    );

    pipeline.push({ $unwind: '$updatorUser' });

    const movimiento = await this.movimientosInternosModel.aggregate(pipeline);

    return movimiento[0];

  }

  // Listar movimientos
  async getAll(querys: any): Promise<any> {

    const {
      columna,
      direccion,
      desde,
      registerpp,
      parametro,
      usuario,
      activo
    } = querys;

    let permisosAdaptados = [];
    let usuarioDB: any  = null;

    // Busco usuario por ID
    if(usuario){
      usuarioDB = await this.usuarioModel.findById(usuario);
      permisosAdaptados = usuarioDB.permisos_cajas?.map((permiso: string) => new Types.ObjectId(permiso));
    }

    const pipeline = [];
    const pipelineTotal = [];

    pipeline.push({ $match: {} });
    pipelineTotal.push({ $match: {} });

    // Activo / Inactivo
    let filtroActivo = {};
    if (activo && activo !== '') {
      filtroActivo = { activo: activo === 'true' ? true : false };
      pipeline.push({ $match: filtroActivo });
      pipelineTotal.push({ $match: filtroActivo });
    }

    // Informacion de caja origen
    pipeline.push({
      $lookup: { // Lookup
        from: 'cajas',
        localField: 'caja_origen',
        foreignField: '_id',
        as: 'caja_origen'
      }
    }
    );

    pipeline.push({ $unwind: '$caja_origen' });

    // Informacion de caja destino
    pipeline.push({
      $lookup: { // Lookup
        from: 'cajas',
        localField: 'caja_destino',
        foreignField: '_id',
        as: 'caja_destino'
      }
    }
    );

    pipeline.push({ $unwind: '$caja_destino' });

    // Informacion de usuario creador
    pipeline.push({
      $lookup: { // Lookup
        from: 'usuarios',
        localField: 'creatorUser',
        foreignField: '_id',
        as: 'creatorUser'
      }
    }
    );

    pipeline.push({ $unwind: '$creatorUser' });

    // Informacion de usuario actualizador
    pipeline.push({
      $lookup: { // Lookup
        from: 'usuarios',
        localField: 'updatorUser',
        foreignField: '_id',
        as: 'updatorUser'
      }
    }
    );

    pipeline.push({ $unwind: '$updatorUser' });

    // mongoose filtrar solo los movimientos por permisos de caja origen o destino
    if(usuario && usuarioDB?.role !== 'ADMIN_ROLE'){
      pipeline.push({
        $match: {
          $or: [
            { 'caja_origen._id': { $in: permisosAdaptados } },
            { 'caja_destino._id': { $in: permisosAdaptados } }
          ]
        }
      });
      pipelineTotal.push({
        $match: {
          $or: [
            { 'caja_origen': { $in: permisosAdaptados } },
            { 'caja_destino': { $in: permisosAdaptados } }
          ]
        }
      });
    }

    // Filtro por parametros
    if (parametro && parametro !== '') {

      const porPartes = parametro.split(' ');
      let parametroFinal = '';

      for (var i = 0; i < porPartes.length; i++) {
        if (i > 0) parametroFinal = parametroFinal + porPartes[i] + '.*';
        else parametroFinal = porPartes[i] + '.*';
      }

      const regex = new RegExp(parametroFinal, 'i');
      pipeline.push({ $match: { $or: [{ nro: Number(parametro) }, { 'caja_origen.descripcion': regex }, { 'caja_destino.descripcion': regex }, { 'observacion': regex }] } });
      pipelineTotal.push({ $match: { $or: [{ nro: Number(parametro) }, { 'caja_origen.descripcion': regex }, { 'caja_destino.descripcion': regex }, { 'observacion': regex }] } });

    }

    // Ordenando datos
    const ordenar: any = {};
    if (columna) {
      ordenar[String(columna)] = Number(direccion);
      pipeline.push({ $sort: ordenar });
    }

    // Paginacion
    pipeline.push({ $skip: Number(desde) }, { $limit: Number(registerpp) });

    const [movimientos, movimientosTotal] = await Promise.all([
      this.movimientosInternosModel.aggregate(pipeline),
      this.movimientosInternosModel.aggregate(pipelineTotal),
    ])

    return {
      movimientos,
      totalItems: movimientosTotal.length,
    };

  }

  // Crear movimiento
  async insert(movimientosInternosDTO: MovimientosInternosDTO): Promise<IMovimientosInternos> {
    const movimientoInterno = new this.movimientosInternosModel(movimientosInternosDTO);
    return await movimientoInterno.save();
  }

  // Actualizar movimiento
  async update(id: string, movimientosInternosUpdateDTO: MovimientosInternosUpdateDTO): Promise<IMovimientosInternos> {
    const movimientoInterno = await this.movimientosInternosModel.findByIdAndUpdate(id, movimientosInternosUpdateDTO, { new: true });
    return movimientoInterno;
  }

  // Alta/Baja de movimiento
  async altaBajaMovimiento(id: string): Promise<any> {

    // Se verifica si el movimiento existe
    const movimientoDB = await this.movimientosInternosModel.findById(id);
    if (!movimientoDB) throw new NotFoundException('El movimiento no existe');
    
    // Se obtienen los saldos de las cajas origen y destino
    const cajaOrigen = await this.cajasModel.findById(movimientoDB.caja_origen);
    const cajaDestino = await this.cajasModel.findById(movimientoDB.caja_destino);

    let nuevoSaldoOrigen = null;
    let nuevoSaldoDestino = null;

    if(movimientoDB.activo){ // Baja de movimiento
      nuevoSaldoOrigen = cajaOrigen.saldo + movimientoDB.monto_origen;
      nuevoSaldoDestino = cajaDestino.saldo - movimientoDB.monto_destino;
    }else{                   // Alta de movimiento
      nuevoSaldoOrigen = cajaOrigen.saldo - movimientoDB.monto_origen;
      nuevoSaldoDestino = cajaDestino.saldo + movimientoDB.monto_destino;
    }
    
    if(nuevoSaldoDestino === null || nuevoSaldoDestino === null) throw new NotFoundException('Error en la baja');

    // Se actualizan los saldos de las cajas
    await this.cajasModel.findByIdAndUpdate(movimientoDB.caja_origen, { saldo: nuevoSaldoOrigen });
    await this.cajasModel.findByIdAndUpdate(movimientoDB.caja_destino, { saldo: nuevoSaldoDestino });

    // Se da de Alta/Baja el movimiento
    const nuevoMovimiento = await this.movimientosInternosModel.findByIdAndUpdate(id, { activo: !movimientoDB.activo },{ new: true });

    return nuevoMovimiento;

  }

}
