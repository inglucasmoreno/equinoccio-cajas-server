import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MovimientosInternosController } from './movimientos-internos.controller';
import { MovimientosInternosService } from './movimientos-internos.service';
import { MovimientosInternosSchema } from './schema/movimientos-internos.schema';
import { usuarioSchema } from 'src/usuarios/schema/usuarios.schema';
import { cajasSchema } from 'src/cajas/schema/cajas.schema';
import { CajasMovimientosSchema } from 'src/cajas-movimientos/schema/cajas-movimientos.schema';

@Module({
  imports: [
		MongooseModule.forFeature([
			{ name: 'MovimientosInternos', schema: MovimientosInternosSchema },
			{ name: 'CajasMovimientos', schema: CajasMovimientosSchema },
			{ name: 'Usuarios', schema: usuarioSchema },
			{ name: 'Cajas', schema: cajasSchema },
		])
	],
  controllers: [MovimientosInternosController],
  providers: [MovimientosInternosService]
})
export class MovimientosInternosModule {}
