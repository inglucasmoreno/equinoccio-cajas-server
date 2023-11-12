import { Module } from '@nestjs/common';
import { CajasUsuariosController } from './cajas-usuarios.controller';
import { CajasUsuariosService } from './cajas-usuarios.service';
import { MongooseModule } from '@nestjs/mongoose';
import { cajasSchema } from 'src/cajas/schema/cajas.schema';
import { usuarioSchema } from 'src/usuarios/schema/usuarios.schema';
import { cajasUsuariosSchema } from './schema/cajas-usuarios.schema';

@Module({
  imports: [
		MongooseModule.forFeature([
			{ name: 'Cajas', schema: cajasSchema },
			{ name: 'Usuarios', schema: usuarioSchema },
			{ name: 'CajasUsuarios', schema: cajasUsuariosSchema },
		])
	],
  controllers: [CajasUsuariosController],
  providers: [CajasUsuariosService]
})
export class CajasUsuariosModule {}
