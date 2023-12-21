import {dbconnect} from "@/history/dbconnect";
let db = new dbconnect();


// 在另一个 async 函数中使用 await 获取异步函数返回值
async function getResult() {
    const result = await db.asyncFunction();
    console.log(result); // 输出异步函数返回值
}

getResult();
