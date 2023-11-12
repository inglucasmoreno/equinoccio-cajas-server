import { IsString } from "class-validator";

export class CajasUsuariosDTO {

  @IsString()
  readonly caja: string;

  @IsString()
  readonly usuario: string;
  
  readonly activo: boolean;

  @IsString()
  readonly creatorUser: string;

  @IsString()
  readonly updatorUser: string;

}