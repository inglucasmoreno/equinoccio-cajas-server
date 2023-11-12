import { Document } from 'mongoose';

export interface ICajasUsuarios extends Document {
  readonly usuario: string;
  readonly caja: string;
  readonly activo: boolean;
  readonly creatorUser: string;
  readonly updatorUser: string;
}