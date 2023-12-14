import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { cajasSchema } from 'src/cajas/schema/cajas.schema';
import { CajasMovimientosController } from './cajas-movimientos.controller';
import { CajasMovimientosService } from './cajas-movimientos.service';
import { CajasMovimientosSchema } from './schema/cajas-movimientos.schema';
import { gastosSchema } from 'src/gastos/schema/gastos.schema';
import { MovimientosInternosSchema } from 'src/movimientos-internos/schema/movimientos-internos.schema';
import { ventasPropiasSchema } from 'src/ventas-propias/schema/ventas-propias.schema';

@Module({
  imports: [
		MongooseModule.forFeature([
			{ name: 'CajasMovimientos', schema: CajasMovimientosSchema },
			{ name: 'Cajas', schema: cajasSchema },
			{ name: 'Gastos', schema: gastosSchema },
			{ name: 'MovimientosInternos', schema: MovimientosInternosSchema },
			{ name: 'VentasPropias', schema: ventasPropiasSchema },
		])
	],
  controllers: [CajasMovimientosController],
  providers: [CajasMovimientosService]
})
export class CajasMovimientosModule {}
