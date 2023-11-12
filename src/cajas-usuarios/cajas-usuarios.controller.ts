import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { CajasUsuariosService } from './cajas-usuarios.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CajasUsuariosDTO } from './dto/cajas-usuarios.dto';
import { CajasUsuariosUpdateDTO } from './dto/cajas-usuarios-update.dto';

@Controller('cajas-usuarios')
export class CajasUsuariosController {

    constructor(private cajasUsuariosService: CajasUsuariosService) { }

    // Caja - Usuario por ID
    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    async getId(@Res() res, @Param('id') cajaUsuarioID) {
        const cajaUsuario = await this.cajasUsuariosService.getId(cajaUsuarioID);
        res.status(HttpStatus.OK).json({
            message: 'Relacion obtenida correctamente',
            cajaUsuario
        });
    }

    // Caja - Usuario por usuario
    @UseGuards(JwtAuthGuard)
    @Get('/usuario/:idUsuario')
    async getPorUsuario(@Res() res, @Param('idUsuario') usuarioID) {
        const cajaUsuario = await this.cajasUsuariosService.getPorUsuario(usuarioID);
        res.status(HttpStatus.OK).json({
            message: 'Relacion obtenida correctamente',
            cajaUsuario
        });
    }

    // Caja - Usuario por caja
    @UseGuards(JwtAuthGuard)
    @Get('/caja/:idCaja')
    async getPorCaja(@Res() res, @Param('idCaja') cajaID) {
        const cajaUsuario = await this.cajasUsuariosService.getPorCaja(cajaID);
        res.status(HttpStatus.OK).json({
            message: 'Relacion obtenida correctamente',
            cajaUsuario
        });
    }

    // Listar Cajas - Usuarios
    @UseGuards(JwtAuthGuard)
    @Get('/')
    async getAll(@Res() res, @Query() querys) {
        const cajasUsuarios = await this.cajasUsuariosService.getAll(querys);
        res.status(HttpStatus.OK).json({
            message: 'Listado de relaciones correcto',
            cajasUsuarios
        });
    }

    // Crear Caja - Usuario
    @UseGuards(JwtAuthGuard)
    @Post('/')
    async insert(@Res() res, @Body() cajasUsuariosDTO: CajasUsuariosDTO) {
        const cajaUsuario = await this.cajasUsuariosService.insert(cajasUsuariosDTO);
        res.status(HttpStatus.CREATED).json({
            message: 'Relacion creada correctamente',
            cajaUsuario
        });
    }

    // Actualizar Caja - Usuario
    @UseGuards(JwtAuthGuard)
    @Put('/:id')
    async update(@Res() res, @Body() cajasUsuariosUpdateDTO: CajasUsuariosUpdateDTO, @Param('id') cajaUsuarioID) {
        const cajaUsuario = await this.cajasUsuariosService.update(cajaUsuarioID, cajasUsuariosUpdateDTO);
        res.status(HttpStatus.OK).json({
            message: 'Relacion actualizada correctamente',
            cajaUsuario
        });
    }

    // Eliminar Caja - Usuario
    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    async delete(@Res() res, @Param('id') cajaUsuarioID) {
        const cajaUsuario = await this.cajasUsuariosService.delete(cajaUsuarioID);
        res.status(HttpStatus.OK).json({
            message: 'Relacion eliminada correctamente',
            cajaUsuario
        });
    }

}
