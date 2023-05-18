const axios = require('axios')  
const fs = require('fs')
const path = require('path')

//需要获取的图片 国家 字母简称
const countries = ["zh-CN", "en-US","ja-JP"]

//获取当前时间
const nowTime = new Date().toISOString().split('T')[0]
//当前目录
const dir = process.cwd()
//同级目录名称
const targetDir = 'data'   
//目标路径  json文件存储的地方 
const targetPath = path.join(dir, targetDir)   
//不存在目录就创建
const dirExists = fs.existsSync(targetPath)
if (!dirExists) {
  fs.mkdirSync(targetPath)
}

countries.forEach(country => {
    const directory = path.join(targetPath,country)
    if(!fs.existsSync(directory)){
        fs.mkdirSync(directory)
    }
    const fileName = `${nowTime}.json`
    const filePath = path.join(directory, fileName)
    if (!fs.existsSync(filePath)) {
        const url = `https://bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mbl=1&mkt=${country}`
        axios.get(url)
        .then(response => {
            const data = response.data.images
            fs.writeFile(filePath, JSON.stringify(data), err => {
                if (err) throw err
            })
        })
    }
  // 添加 3 秒延迟
  setTimeout(() => {}, 3000) 
})
