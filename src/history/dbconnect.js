export class dbconnect{

    constructor() {


    }

    async getFavorites(){
        return new Promise((resolve, reject) => {
            // 异步操作
            let favorites = [];
            fetch('/api/getFavorites', {
                method: 'POST',
                //mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({ query: "1"})
            }).then(response => response.json())
                .then(data => {
                    //console.log(data);
                    favorites.push(data);
                    console.log(favorites);
                    console.log("获取收藏夹成功");
                    resolve(favorites); // 异步操作完成后调用 resolve 返回值
                })
                .catch(error => {
                    console.error('获取收藏夹失败:', error);
                });


        });



    }


    async asyncFunction() {
        let a = 114;
        return new Promise((resolve, reject) => {
            // 异步操作
            setTimeout(() => {
                resolve(a); // 异步操作完成后调用 resolve 返回值
            }, 2000);
        });
    }
}