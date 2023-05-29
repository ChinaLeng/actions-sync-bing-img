const axios = require('axios')  
const fs = require('fs')
const path = require('path')

//需要获取的图片 国家 字母简称  
//中国 zh-CN | 德国 de-DE | 加拿大 en-CA | 英国 en-GB | 印度 en-IN | 美国 en-US | 法国 fr-FR | 意大利 it-IT | 日本 ja-JP | 澳大利亚 en-AU 
//新加坡 en-SG | 西班牙 es-ES | 韩国 ko-KR
const countries = ["zh-CN", "de-DE", "en-CA", "en-GB", "en-IN", "en-US", "fr-FR", "it-IT", "ja-JP","en-AU","es-ES","en-SG","ko-KR"]

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
    //按照国家字母缩写 存所有数据json
    const countryFileAllName = `${country}_ALL.json`
    const countryFileAllPath = path.join(targetPath,countryFileAllName)
    if (!fs.existsSync(countryFileAllPath)) {
        fs.writeFile(countryFileAllPath, '[]', err => {
            if (err) throw err; 
          });
    }
    const fileName = `${nowTime}.json`
    const filePath = path.join(directory, fileName)
    if (!fs.existsSync(filePath)) {
        const url = `https://bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mbl=1&mkt=${country}`
        axios.get(url)
        .then(response => {
            const imageList = response.data.images
            if(imageList.length > 0){
              const dataImg = imageList[0]
              fs.writeFile(filePath, JSON.stringify(dataImg), err => {
                  if (err) throw err
              })
              const countryFileAllContent = fs.readFileSync(countryFileAllPath)
              const countryFileAllJson = JSON.parse(countryFileAllContent)
              countryFileAllJson.push(dataImg);
              fs.writeFile(countryFileAllPath, JSON.stringify(countryFileAllJson), err => {
                  if (err) throw err;
                });
            }
            
        })
    }
  // 添加 3 秒延迟
  setTimeout(() => {}, 3000) 
})