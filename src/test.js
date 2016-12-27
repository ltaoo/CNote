import colors from 'colors';
async function person() {
	try {
		let result = await getResult();
		console.log(`${result}`.green);
	}catch(err) {
		console.log(`err${JSON.stringify(err)}`.red);
	}
}



function getResult() {
	return new Promise((resolve, reject) => {
		// 获取一个随机数
		let per = Math.random()*100;
		if(per > 50) {
			resolve(per);
		}else {
			reject(per);
		}
	})
}

person();