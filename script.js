const tHeadRow = document.getElementById('table-heading-row');
const tBody = document.getElementById('table-body');
let currentCell;

const boldButton = document.getElementById('bold-btn');
const itlaicsButton = document.getElementById('italics-btn');
const underlineButton = document.getElementById('underline-btn');
const leftAlign = document.getElementById('left-align');
const centerAlign = document.getElementById('center-align');
const rightAlign = document.getElementById('right-align');
const fontSizeDropDown = document.getElementById('font-size');
const fontStyleDropDown = document.getElementById('font-style');
const bgColorInput = document.getElementById('bg-color');
const textColorInput = document.getElementById('text-color');
const cutButton = document.getElementById('cut-btn');
const copyButton = document.getElementById('copy-btn');
const pasteButton = document.getElementById('paste-btn');
let cutCell = {};
const donwloadButton = document.getElementById('download-btn');
const uploadJsonFile = document.getElementById('json-file');

const columns = 26;
const rows = 100;


for(let col=0;col<columns;col++){
    let th = document.createElement('th');
    //converting number to string of ascii value
    th.innerText=String.fromCharCode(col+65);
    tHeadRow.append(th);
}

for(let row=1;row<=rows;row++){
    let tr = document.createElement('tr');
    //number cell
    let th = document.createElement('th');
    // injecting numbere in th
    th.innerText=row;
    tr.append(th);
    // appending 26 empty tds
    for(let col=0;col<columns;col++){
        let td = document.createElement('td');
        td.setAttribute('contenteditable',true);
        td.setAttribute('id',`${String.fromCharCode(col+65)}${row}`);
        td.addEventListener('input',(event)=>onInputFn(event));
        td.addEventListener('focus',(event)=>
            onFocusFn(event))
        tr.append(td);
    }
    tBody.append(tr)
}


let matrix = new Array(rows);
for(let row=0;row<rows;row++){
    matrix[row]=new Array(columns);
    for(let col=0;col<columns;col++){
        matrix[row][col]={};
    }
}

function onInputFn(event){
    updateMatrix(event.target);
    //id,cellcontent,cell style
}
function updateMatrix(currentCell){
    let tempObj = {
        style:currentCell.style.cssText,
        text:currentCell.innerText,
        id:currentCell.id,
    }
    let j = currentCell.id[0].charCodeAt(0)-65;///this is col
    //currentCell.id[0]->this we give me a character
    //str.charCodeAt(i) will give me respective ascii at ith index of string str
    //-65 for making ascii code to 0th index
    let i = currentCell.id.substr(1)-1;
    matrix[i][j]=tempObj;
    console.log(matrix);
}


function onFocusFn(event){
    currentCell=event.target;
    document.getElementById('current-cell').innerText=currentCell.id;
}

boldButton.addEventListener('click',()=>{
    // if(currentCell.style.fontWeight==='bold'){
    //     currentCell.style.fontWeight='normal';
    // }
    // else{
    // currentCell.style.fontWeight='bold';
    // }
    // by using ternary operator
    currentCell.style.fontWeight = currentCell.style.fontWeight==='bold'?'normal':'bold';
    //latest style should be passed to update matrix
    updateMatrix(currentCell);
})

itlaicsButton.addEventListener('click',()=>{
    currentCell.style.fontStyle = currentCell.style.fontStyle==='italic'?'normal':'italic';
    updateMatrix(currentCell);
})

underlineButton.addEventListener('click',()=>{
    currentCell.style.textDecoration = currentCell.style.textDecoration==='underline'?'none':'underline';
    updateMatrix(currentCell);
})

leftAlign.addEventListener('click',()=>{
    currentCell.style.textAlign = 'left';
    updateMatrix(currentCell);
})

centerAlign.addEventListener('click',()=>{
    currentCell.style.textAlign = 'center';
    updateMatrix(currentCell);
})

rightAlign.addEventListener('click',()=>{
    currentCell.style.textAlign = 'right';
    updateMatrix(currentCell);
})

fontSizeDropDown.addEventListener('change',()=>{
    // whatever option the tag is chosen by end user is mapped with select tag
    currentCell.style.fontSize=fontSizeDropDown.value;
    updateMatrix(currentCell);
})

fontStyleDropDown.addEventListener('change',()=>{
    // whatever option the tag is chosen by end user is mapped with select tag
    currentCell.style.fontFamily=fontStyleDropDown.value;
    updateMatrix(currentCell);
})

textColorInput.addEventListener('change',()=>{
    currentCell.style.color=textColorInput.value;
    updateMatrix(currentCell);
})

bgColorInput.addEventListener('change',()=>{
    currentCell.style.backgroundColor=bgColorInput.value;
    updateMatrix(currentCell);
})

let lastPressedButton;
cutButton.addEventListener('click',()=>{
    //store currentCell
    cutCell={
        style:currentCell.style.cssText,
        text:currentCell.innerText,
    }
    currentCell.innerText='';
    currentCell.style.cssText='';
    lastPressedButton=cutButton;
    updateMatrix(currentCell);
})

copyButton.addEventListener('click',()=>{
    cutCell={
        style:currentCell.style.cssText,
        text:currentCell.innerText,
    }
    lastPressedButton=copyButton;
})

pasteButton.addEventListener('click',()=>{
    currentCell.innerText=cutCell.text;
    currentCell.style.cssText=cutCell.style;
    if(lastPressedButton===cutButton){
        cutCell={};
    }
    updateMatrix(currentCell);
})


donwloadButton.addEventListener('click',()=>{
    //2d matrix into string
    const matrixString = JSON.stringify(matrix);
    // text form of matrix convert into piece of memory (downloadable)
    const blob = new Blob([matrixString],{type:'application/json'});
    //link created->attacch href
    //click link
    //delete link
    const link = document.createElement('a');
    //211->converting piece ofmemory to downloadable link
    link.href=URL.createObjectURL(blob);
    link.download='table.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
})


uploadJsonFile.addEventListener('change',uploadJsonFileFn);

function uploadJsonFileFn(event){
    const file = event.target.files[0];
    if(file){
        //filereader can read extrenal file
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload=function(e){
            const fileContent = e.target.result;
            try{
                //updated my matrix
                matrix = JSON.parse(fileContent);
                matrix.forEach(row=>{
                    row.forEach(cell=>{
                        if(cell.id){
                            let cellToBeEdited = document.getElementById(cell.id);
                            cellToBeEdited.innerText=cell.text;
                            cellToBeEdited.style.cssText=cell.style;
                        }
                    })
                })
            }
            catch(err){
                console.log(err);
            }
        }
    }
}