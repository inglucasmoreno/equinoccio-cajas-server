import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ICajas } from 'src/cajas/interface/cajas.interface';
import { IUsuario } from 'src/usuarios/interface/usuarios.interface';
import { ICajasUsuarios } from './interface/cajas-usuarios.interface';
import { CajasUsuariosDTO } from './dto/cajas-usuarios.dto';
import { CajasUsuariosUpdateDTO } from './dto/cajas-usuarios-update.dto';

@Injectable()
export class CajasUsuariosService {

  constructor(@InjectModel('Cajas') private readonly cajasModel: Model<ICajas>,
    @InjectModel('Usuarios') private readonly usuariosModel: Model<IUsuario>,
    @InjectModel('CajasUsuarios') private readonly cajasUsuariosModel: Model<ICajasUsuarios>,
  ) { };

  // CajaUsuario por ID
  async getId(id: string): Promise<ICajasUsuarios> {

    // Se verifica que la cajaUsuario existe
    const cajaUsuarioDB = await this.cajasUsuariosModel.findById(id);
    if (!cajaUsuarioDB) throw new NotFoundException('La relacion no existe');

    const pipeline = [];

    // CajaUsuario por ID
    const idCajaUsuario = new Types.ObjectId(id);
    pipeline.push({ $match: { _id: idCajaUsuario } })

    // Informacion de caja

    pipeline.push({
      $lookup: { // Lookup
        from: 'cajas',
        localField: 'caja',
        foreignField: '_id',
        as: 'caja'
      }
    }
    );

    pipeline.push({ $unwind: '$caja' });

    // Informacion de usuario

    pipeline.push({
      $lookup: { // Lookup
        from: 'usuarios',
        localField: 'usuario',
        foreignField: '_id',
        as: 'usuario'
      }
    }
    );

    pipeline.push({ $unwind: '$usuario' });

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

    const cajaUsuario = await this.cajasUsuariosModel.aggregate(pipeline);

    return cajaUsuario[0];

  }

  // CajaUsuario por Usuario
  async getPorUsuario(usuario: string): Promise<ICajasUsuarios> {

    // Se verifica que la cajaUsuario existe
    // const cajaUsuarioDB = await this.cajasUsuariosModel.findOne({ usuario });
    // if (!cajaUsuarioDB) throw new NotFoundException('La relacion no existe');

    const pipeline = [];

    // CajaUsuario por ID
    const idUsuario = new Types.ObjectId(usuario);
    pipeline.push({ $match: { usuario: idUsuario } })

    // Informacion de caja

    pipeline.push({
      $lookup: { // Lookup
        from: 'cajas',
        localField: 'caja',
        foreignField: '_id',
        as: 'caja'
      }
    }
    );

    pipeline.push({ $unwind: '$caja' });

    // Informacion de usuario

    pipeline.push({
      $lookup: { // Lookup
        from: 'usuarios',
        localField: 'usuario',
        foreignField: '_id',
        as: 'usuario'
      }
    }
    );

    pipeline.push({ $unwind: '$usuario' });

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

    const cajaUsuario = await this.cajasUsuariosModel.aggregate(pipeline);

    return cajaUsuario[0];

  }

  // CajaUsuario por Caja
  async getPorCaja(caja: string): Promise<ICajasUsuarios> {

    // Se verifica que la cajaUsuario existe
    // const cajaUsuarioDB = await this.cajasUsuariosModel.findOne({ usuario });
    // if (!cajaUsuarioDB) throw new NotFoundException('La relacion no existe');

    const pipeline = [];

    // CajaUsuario por ID
    const idCaja = new Types.ObjectId(caja);
    pipeline.push({ $match: { caja: idCaja } })

    // Informacion de caja

    pipeline.push({
      $lookup: { // Lookup
        from: 'cajas',
        localField: 'caja',
        foreignField: '_id',
        as: 'caja'
      }
    }
    );

    pipeline.push({ $unwind: '$caja' });

    // Informacion de usuario

    pipeline.push({
      $lookup: { // Lookup
        from: 'usuarios',
        localField: 'usuario',
        foreignField: '_id',
        as: 'usuario'
      }
    }
    );

    pipeline.push({ $unwind: '$usuario' });

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

    const cajaUsuario = await this.cajasUsuariosModel.aggregate(pipeline);

    return cajaUsuario[0];

  }

  // Listar CajasUsuarios
  async getAll(querys: any): Promise<ICajasUsuarios[]> {

    const {
      columna,
      direccion,
    } = querys;

    const pipeline = [];
    pipeline.push({ $match: {} });

    // Informacion de caja

    pipeline.push({
      $lookup: { // Lookup
        from: 'cajas',
        localField: 'caja',
        foreignField: '_id',
        as: 'caja'
      }
    }
    );

    pipeline.push({ $unwind: '$caja' });

    // Informacion de usuario

    pipeline.push({
      $lookup: { // Lookup
        from: 'usuarios',
        localField: 'usuario',
        foreignField: '_id',
        as: 'usuario'
      }
    }
    );

    pipeline.push({ $unwind: '$usuario' });

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

    // Ordenando datos
    const ordenar: any = {};
    if (columna) {
      ordenar[String(columna)] = Number(direccion);
      pipeline.push({ $sort: ordenar });
    }

    const cajasUsuarios = await this.cajasUsuariosModel.aggregate(pipeline);

    return cajasUsuarios;

  }

  // Crear CajaUsuario
  async insert(cajasUsuariosDTO: CajasUsuariosDTO): Promise<ICajasUsuarios> {

    // Verificar el usuario ya tiene asignada una caja
    const cajaUsuarioDB = await this.cajasUsuariosModel.findOne({ usuario: cajasUsuariosDTO.usuario });
    if (cajaUsuarioDB) throw new NotFoundException('El usuario ya tiene asignada una caja');

    // Verificamos si otro usuario ya tiene asignada esta caja
    const cajaUsuarioDB2 = await this.cajasUsuariosModel.findOne({ caja: cajasUsuariosDTO.caja });
    if (cajaUsuarioDB2) throw new NotFoundException('La caja ya esta asignada a otro usuario');

    const nuevaCajaUsuario = new this.cajasUsuariosModel(cajasUsuariosDTO);
    const nuevaCajaUsuarioDB = await nuevaCajaUsuario.save();
    return this.getId(nuevaCajaUsuarioDB._id);

  }

  // Actualizar cajaUsuario
  async update(id: string, cajasUsuariosUpdateDTO: CajasUsuariosUpdateDTO): Promise<ICajasUsuarios> {

    const cajasUsuariosDB = await this.cajasUsuariosModel.findById(id);

    // Verificacion: La caja - usuario no existe
    if (!cajasUsuariosDB) throw new NotFoundException('La relacion no existe');

    const cajaUsuario = await this.cajasUsuariosModel.findByIdAndUpdate(id, cajasUsuariosUpdateDTO, { new: true });
    return cajaUsuario;

  }

  // Eliminar cajaUsuario
  async delete(id: string): Promise<ICajasUsuarios> {

    // Se verifica si la caja a eliminar existe
    const cajaUsuarioDB = await this.cajasUsuariosModel.findById(id);
    if (!cajaUsuarioDB) throw new NotFoundException('La relacion no existe');

    // Eliminar caja por id
    const cajaUsuario = await this.cajasUsuariosModel.findByIdAndDelete(id);
    return cajaUsuario;

  }

}
