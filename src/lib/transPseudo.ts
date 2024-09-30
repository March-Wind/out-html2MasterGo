import type { IRectangleNode, TargetProps } from './index.d';
import { transShape, transRectangleCorner } from './mixins';

export const transPseudo = (pseudoType: '::before' | '::after', styles: TargetProps, parentStyles: TargetProps) => {
  if (styles.display === 'none') {
    return null
  }

  const result = {
    ...transShape(pseudoType, styles, parentStyles, 'RECTANGLE'),
    ...transRectangleCorner(styles),
    type: 'RECTANGLE'
  } as IRectangleNode;

  return result;
};