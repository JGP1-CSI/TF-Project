import express from 'express';
import sql from 'mssql';
import cors from 'cors';

const app = express();


app.use(cors());
app.use(express.json());

// Database Configuration
const dbConfig = {
  user: 'SA',
  password: 'MyStrongPass123',
  server: 'localhost',
  database: 'master', 
  options: {
    encrypt: true,
    trustServerCertificate: true,
  }
};

let pool;

sql.connect(dbConfig).then((connectedPool) => {
  pool = connectedPool;
  console.log("Connected to database");

// Fetch all transformers
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT 
        t.id,
        t.TransformerName,
        t.faction,
        d.TransformersDescription
      FROM 
        transformers t
      JOIN 
        description d ON t.id = d.id
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error("Error fetching transformers:", error);
    res.status(500).json({ error: error.message });
  }
});

  // Fetch active tickets for a transformer based on its ID
  app.get("/api/tickets", async (req, res) => {
    const { transformerId } = req.query;

    try {
      let query = `
        SELECT 
          ticketId, 
          id, 
          description AS ticketDescription,  -- Renamed to match your table
          faction, 
          status
        FROM tickets
        WHERE status = 'Pending'
      `;
  
      if (transformerId) {
        query += ` AND id = @transformerId`;
      }

      const result = await pool.request()
        .input('transformerId', sql.Int, transformerId)
        .query(query);

      res.json(result.recordset);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Start the server
  app.listen(6802, () => {
    console.log("Server running on port 6802");
  });
}).catch(err => {
  console.error("Database connection error:", err);
});

