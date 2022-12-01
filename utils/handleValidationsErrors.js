import { validationResult } from 'express-validator'; // позволяет нам проверить нашу валидацию на ошибки

export default (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }
  next();
};
