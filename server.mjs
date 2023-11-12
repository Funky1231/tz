import express from 'express';
import {DataTypes, Sequelize, Transaction} from "sequelize";


const app = express();

const sequelize = new Sequelize('db', 'user', 'pass', {
        host: "127.0.0.1",
        dialect: "postgres"
});

app.use(express.json());

const User = sequelize.define('User', {
    balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
});

app.put('/updateBalance/:userId/:amount', async (req, res) => {
    const { userId, amount } = req.params;
    try {
        await sequelize.transaction(async (t) => {
            const user = await User.findByPk(userId, { transaction: t, lock: Transaction.LOCK.UPDATE });
            if (user.balance >= amount) {
                await user.update({ balance: user.balance - amount }, { transaction: t });
                res.status(200).json({ message: 'Баланс успешно обновлен' });
            } else {
                res.status(400).json({ error: 'Недостаточно средств на балансе' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});






