# Timezone Clock

![index](/public/TimezoneIndex.png)

## 專案介紹

本專案簡易模擬時區換算網站[World Time Buddy](https://www.worldtimebuddy.com/)，使用者可根據需求設定地區，瀏覽各地區之日期及時間。

---
## 專案功能
#### 手機模式
- 使用者可查看各地區地名、時區名稱，當下日期、星期、時間
- 使用者可選擇顯示AM/PM、24Hr時間模式
- 使用者可新增、移除指定地區
- 使用者可拖曳清單順序、或根據時區正序/倒序排列
#### 網頁模式
- 使用者將指定地區設為主要時區
- 使用者可點擊24小時面板、查看各地區的詳細相對時間
- 使用者可指定日期、查看的各地區時間資料
---
## 環境建置
- 程式編輯：Visual Studio Code
- 前端框架：Vue 2、Bootstrap 4.6.1
- 其他套件：Axios、Moment、Moment-timezone、Vuedraggable、uuid、Sweetalert2
- 第三方API：[WorldTimeAPI](http://worldtimeapi.org/pages/examples)
---
## 專案安裝
1.使用終端機(Terminal)，將以下專案複製(clone)至本機
```
https://github.com/Joy-Chang-2021/Timezone_Clock.git
```
2.進入此專案資料夾
```
cd timezone
```
3.安裝npm套件
```
npm install
```
4.啟動專案
```
npm run serve
```
5.根據終端機指示，使用網址 http://localhost:8080 瀏覽網頁

6.於終端機輸入以下指令，關閉專案
```
Ctrl + C
```