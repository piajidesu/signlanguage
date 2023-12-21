const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());


const PORT = 3301; // 选择一个合适的端口


// 配置 MySQL 数据库连接
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'history'// 设置数据库连接信息
});

// 连接到数据库
connection.connect(err => {
    if (err) {
        console.error('数据库连接错误:', err);
        return;
    }
    console.log('已连接到数据库');
});

// 解析请求体
app.use(bodyParser.json());


// 保存搜索记录的路由，处理 POST 请求到 '/saveSearch'
app.post('/api/save', (req, res) => {

    const { query } = req.body;
    var cookie = req.cookies.userId;
    console.log(cookie);
    // 执行数据库查询来保存搜索记录
    const sql = 'INSERT INTO search_history (user_cookie,search_query, search_time , is_collected) VALUES (?, ?,NOW(),false)';
    connection.query(sql, [cookie, query], (err, result) => {

        if (err) {
            console.error('保存搜索记录时出现错误:', err);
            res.status(500).send('保存搜索记录时出现错误');
            return;
        }
        console.log('搜索记录已保存');
        res.status(200).send('搜索记录已保存');
    });
});



app.post('/api/get_history',(req,res) => {
    var cookie = req.cookies.userId;
    //查询未收藏
    const sql = 'SELECT id,search_query,is_collected FROM search_history WHERE user_cookie = ?';
    console.log(sql);
    connection.query(sql, [cookie] ,(err,result) => {
        if (err) {
            console.error('获取搜索记录时出现错误:', err);
            res.status(500).send('获取搜索记录时出现错误');
            return;
        }
        console.log('已获取搜索记录');
        console.log(result);
        res.status(200).send(result);
    })
})

app.post('/api/getCollect',(req,res) => {
    let cookie = req.cookies.userId;
    //查询未收藏
    const sql = 'SELECT collection_id,collect_query FROM collected WHERE user_cookie = ?';
    connection.query(sql, [cookie] ,(err,result) => {
        if (err) {
            console.error('获取搜索记录时出现错误:', err);
            res.status(500).send('获取搜索记录时出现错误');
            return;
        }
        console.log('已获取搜索记录');
        console.log(result);
        res.status(200).send(result);
    })
})

app.post('/api/getCollectionByFavorite',(req,res) => {
    let { query } = req.body;
    const sql = 'SELECT c.collection_id, c.collect_query\n' +
        'FROM collected c\n' +
        'JOIN Favorites_Collections fc ON c.collection_id = fc.collection_id\n' +
        `WHERE fc.favorite_id = ${query};`;
    connection.query(sql ,(err,result) => {
        if (err) {
            console.error('获取搜索记录时出现错误:', err);
            res.status(500).send('获取搜索记录时出现错误');
            return;
        }
        console.log('已获取搜索记录');
        console.log(result);
        res.status(200).send(result);
    })
})
app.post('/api/getFavorites',(req,res) => {
    let cookie = req.cookies.userId;
    //查询未收藏
    const sql = 'SELECT favorite_id,favorite_name FROM favorites WHERE user_cookie = ?';
    connection.query(sql, [cookie] ,(err,result) => {
        if (err) {
            console.error('获取搜索记录时出现错误:', err);
            res.status(500).send('获取搜索记录时出现错误');
            return;
        }
        console.log('已获取搜索记录');
        console.log(result);
        res.status(200).send(result);
    })
})

app.post('/api/delete', (req, res) => {
    var cookie = req.cookies.userId;
    const { query } = req.body;
    // 执行数据库查询来保存搜索记录
    const sql = 'DELETE FROM search_history WHERE search_query = ? and user_cookie = ?';
    connection.query(sql, [query,cookie] , (err, result) => {

        if (err) {
            console.error('删除时出现错误:', err);
            res.status(500).send('删除时出现错误');
            return;
        }
        console.log('搜索记录已删除');
        res.status(200).send('已删除');
    });
});

app.post('/api/deleteCollect', (req, res) => {
    var cookie = req.cookies.userId;
    const { query } = req.body;
    // 执行数据库查询来保存搜索记录
    const sql = 'DELETE FROM collected WHERE collect_query = ? and user_cookie = ?';
    connection.query(sql, [query,cookie] , (err, result) => {

        if (err) {
            console.error('删除时出现错误:', err);
            res.status(500).send('删除时出现错误');
            return;
        }
        console.log('搜索记录已删除');
        res.status(200).send('已删除');
    });
});



app.post('/api/delete_all', (req, res) => {
    var cookie = req.cookies.userId;
    const { query } = req.body;
    // 执行数据库查询来保存搜索记录
    const sql = 'DELETE FROM search_history WHERE is_collected = 0 and user_cookie = ?';
    connection.query(sql, [cookie] ,(err, result) => {

        if (err) {
            console.error('全部删除时出现错误:', err);
            res.status(500).send('全部删除时出现错误');
            return;
        }
        console.log('搜索记录已全部删除');
        res.status(200).send('已删除');
    });
});

app.post('/api/collect', (req, res) => {
    const { query } = req.body;
    console.log(query)
    let cookie = req.cookies.userId;
    console.log(cookie);
    // 执行数据库查询来保存搜索记录
    const sql = 'INSERT INTO collected (collect_query,collect_time,user_cookie) values(?,NOW(),?)';
    connection.query(sql, [query,cookie], (err, result) => {
        if (err) {
            console.error('收藏时出现错误:', err);
            res.status(500).send('收藏时出现错误');
            return;
        }
        console.log('成功');
        res.status(200).send('成功');
    });
});


// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器已启动，运行在端口 ${PORT}`);
});

