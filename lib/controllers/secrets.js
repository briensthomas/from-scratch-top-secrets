const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const { Secret } = require('../models/Secret');

module.exports = Router()  
  .get('/', authenticate, async (req, res, next) => {
    try {
      const allSecrets = await Secret.getAll();
      const secrets = allSecrets.map((secret) => 
        ({ title: secret.title, 
          description: secret.description, 
          created_at: secret.created_at }));      
      res.json(secrets);
    } catch(err) {
      next(err);
    }
  });
