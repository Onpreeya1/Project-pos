const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();


const port = 8001;

app.use(bodyParser.json());
app.use(cors());

let product = [];
let conn = null;

// ฟังก์ชันเชื่อมต่อ MySQL
const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 9200
    });
};
const validateData = (userData) => {
    let errors = []

    if (!userData.name_member) {
        errors.push('กรุณากรอกชื่อ')
    }
    if (!userData.lastname_member) {
        errors.push('กรุณากรอกนามสกุล')
    }
    if(!userData.gender){
        errors.push('กรุณาเลือกเพศ')
    }
    if(!userData.phon){
        errors.push('กรุุณากรอกเบอร์ติดต่อ')
    }
    return errors
}

// ✅ ดึง Users ทั้งหมด
app.get('/table_member', async (req, res) => {
    try {
        if (!conn) await initMySQL();
        const [results] = await conn.query('SELECT * FROM table_member');
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// ✅ เพิ่มสมาชิกใหม่
app.post('/table_member', async (req, res) => {
    try {
        let member = req.body;
        const errors = validateData(member);
        if (errors.length > 0) {
            throw { message: 'กรุณากรอกข้อมูลให้ครบ', errors: errors };
        }
        const [results] = await conn.query(
            'INSERT INTO  table_member (name_member,lastname_member,gender,phon) VALUES (?, ?, ?, ?)',
            [member.name_member, member.lastname_member, member.gender, member.phon]
        );
        res.json({ message: 'เพิ่มข้อมูลสำเร็จ', data: results });
    } catch (error) {
        res.status(500).json({ message: error.message, errors: error.errors || [] });
    }
});

// ✅ ดึงข้อมูลสมาชิกตาม ID
app.get('/table_member/:id', async (req, res) => {
    try {
        if (!conn) await initMySQL();
        let id = req.params.id;
        const [results] = await conn.query('SELECT * FROM table_member WHERE id = ?', [id]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(results[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// ✅ อัปเดตข้อมูลสมาชิก
app.put('/table_member/:id', async (req, res) => {
    try {
        if (!conn) await initMySQL();
        let id = req.params.id;
        let updateUser = req.body;
        const [results] = await conn.query('UPDATE table_member SET ? WHERE id = ?', [updateUser, id]);
        res.json({ message: 'Update user successfully', affectedRows: results.affectedRows });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// ✅ ลบสมาชิก
app.delete('/table_member/:id', async (req, res) => {
    try {
        if (!conn) await initMySQL();
        let id = req.params.id;
        const [results] = await conn.query('DELETE FROM table_member WHERE id = ?', [id]);
        res.json({ message: 'Delete user successfully', affectedRows: results.affectedRows });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});



// ✅ ดึง Users ทั้งหมด
app.get('/Product', async (req, res) => {
    try {
        if (!conn) await initMySQL();
        const [results] = await conn.query('SELECT * FROM Product');
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// ✅ เพิ่มสมาชิกใหม่
app.post('/Product', async (req, res) => {
    try {
        if (!conn) await initMySQL();
        let id = req.body;
        const errors = validateData(member);
        if (errors.length > 0) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ', errors });
        }
        const [results] = await conn.query('INSERT INTO Product SET ?', );
        res.json({ message: 'Create user successfully', id: results.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// ✅ ดึงข้อมูลสมาชิกตาม ID
app.get('/Product/:id', async (req, res) => {
    try {
        if (!conn) await initMySQL();
        let id = req.params.id;
        const [results] = await conn.query('SELECT * FROM Product WHERE id = ?', [id]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(results[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// ✅ อัปเดตข้อมูลสมาชิก
app.put('/Product/:id', async (req, res) => {
    try {
        if (!conn) await initMySQL();
        let id = req.params.id;
        let updateUser = req.body;
        const [results] = await conn.query('UPDATE Product SET ? WHERE id = ?', [updateUser, id]);
        res.json({ message: 'Update user successfully', affectedRows: results.affectedRows });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// ✅ ลบสมาชิก
app.delete('/Product/:id', async (req, res) => {
    try {
        if (!conn) await initMySQL();
        let id = req.params.id;
        const [results] = await conn.query('DELETE FROM table_member WHERE id = ?', [id]);
        res.json({ message: 'Delete user successfully', affectedRows: results.affectedRows });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});









// ✅ ดึง Users ทั้งหมด
app.get('/stock', async (req, res) => {
    try {
        if (!conn) await initMySQL();
        const [results] = await conn.query('SELECT * FROM stock');
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// ✅ เพิ่มสมาชิกใหม่
app.post('/stock', async (req, res) => {
    try {
        let stock = req.body;
        const errors = validateData(stock);
        if (errors.length > 0) {
            throw { message: 'กรุณากรอกข้อมูลให้ครบ', errors: errors };
        }
        const [results] = await conn.query(
            'INSERT INTO  stock (product_name,price,image_url,category,created_at,stock_quantity) VALUES (?, ?, ?, ?,?,?)',
            [stock.product_name, stock.price, stock.image_url, stock.category,stock.stock_quantity]
        );
        res.json({ message: 'เพิ่มข้อมูลสำเร็จ', data: results });
    } catch (error) {
        res.status(500).json({ message: error.message, errors: error.errors || [] });
    }
});

// ✅ ดึงข้อมูลสมาชิกตาม ID
app.get('/stock/:id', async (req, res) => {
    try {
        if (!conn) await initMySQL();
        let id = req.params.id;
        const [results] = await conn.query('SELECT * FROM stock WHERE id = ?', [id]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(results[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// ✅ อัปเดตข้อมูลสมาชิก
app.put('/stock/:id', async (req, res) => {
    try {
        if (!conn) await initMySQL();
        let id = req.params.id;
        let updateUser = req.body;
        const [results] = await conn.query('UPDATE stock SET ? WHERE id = ?', [updateUser, id]);
        res.json({ message: 'Update user successfully', affectedRows: results.affectedRows });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// ✅ ลบสมาชิก
app.delete('/stock/:id', async (req, res) => {
    try {
        if (!conn) await initMySQL();
        let id = req.params.id;
        const [results] = await conn.query('DELETE FROM stock WHERE id = ?', [id]);
        res.json({ message: 'Delete user successfully', affectedRows: results.affectedRows });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});
// ✅ เริ่มเซิร์ฟเวอร์
app.listen(port, async () => {
    await initMySQL();
    console.log(`🚀 Server is running on port ${port}`);
});
