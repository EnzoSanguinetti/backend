
router.get('/', async (req, res) => {
    try {
      const users = await User.find({}, 'nombre correo rol');
      res.status(200).json({ success: true, users });
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ success: false, error: 'Error al obtener usuarios' });
    }
  });
  

router.delete('/', async (req, res) => {
    try {
      
      const cutoffDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); 
      const result = await User.deleteMany({ lastConnection: { $lt: cutoffDate } });
  
      
      result.deletedCount > 0 && sendInactiveAccountEmails();
  
      res.status(200).json({ success: true, deletedCount: result.deletedCount });
    } catch (error) {
      console.error('Error al eliminar usuarios inactivos:', error);
      res.status(500).json({ success: false, error: 'Error al eliminar usuarios inactivos' });
    }
  });
  
  
  function sendInactiveAccountEmails() {

  }
  