import { Schema } from 'mongoose';

export const cajasUsuariosSchema = new Schema({
  
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'usuario',
    required: true,
  },

  caja: {
    type: Schema.Types.ObjectId,
    ref: 'cajas',
    required: true,
  },

  activo: {
    type: Boolean,
    default: true
  },

  creatorUser: {
    type: Schema.Types.ObjectId,
    ref: 'usuario',
    required: true,
  },

  updatorUser: {
    type: Schema.Types.ObjectId,
    ref: 'usuario',
    required: true,
  }

},{ timestamps: true, collection: 'cajas_usuarios' })