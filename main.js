const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');
const scorePontos = document.querySelector('#scorepontos');


canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let score = 0;

const player = {
    x: 270,
    y: 460,
    w: 50,
    h: 15,
    dx: 5
}

const ball = {
    x: 300,
    y: 460,
    radius: 7,
    dx: 4,
    dy: 9,
}

const obstaculos = {
    rows: 7,
    cols: 4, 
}

const obstaculo = {
    w: 60,
    h: 20,
    padding: 15,
    offsetX: 140,
    offsetY: 50,
    visible: true,
}

let obstaculoLength = obstaculos.rows * obstaculos.cols;


const obstaculosarr = [];



for(let i = 0;i < obstaculos.rows; i++){
    obstaculosarr[i] = [];

    for(let j = 0; j < obstaculos.cols; j++){
        const x = i * (obstaculo.w + obstaculo.padding) + obstaculo.offsetX
        const y = j * (obstaculo.w + obstaculo.padding) + obstaculo.offsetY

        obstaculosarr[i][j] = {
            x,
            y,
            ...obstaculo,
        }
    }
}

function game() {
    update();
    render();
    requestAnimationFrame(game);
}
requestAnimationFrame(game);


//----------Ação
let playerDiraction = " ";

document.addEventListener('keydown', (e) => {
    if(e.keyCode === 65) playerDiraction = "left";
    if(e.keyCode === 68) playerDiraction = "right";
})
document.addEventListener('keyup', (e) => {
    if(e.keyCode === 65) playerDiraction = "";
    if(e.keyCode === 68) playerDiraction = "";
})

function moverPlayer(){
    if(playerDiraction === "left") player.x -= player.dx;
    if(playerDiraction === "right") player.x += player.dx;

    if(player.x <= 0) player.x = 0;
    if(player.x >= 800 - player.w) player.x = 800 - player.w;
}

function moverBall(){
    ball.x += ball.dx;
    ball.y -= ball.dy;
    
    if(ball.x + ball.radius >= 800 || ball.x <= ball.radius) ball.dx = -ball.dx;
    if(ball.y <= 0 || ball.y + ball.radius >= 530) ball.dy = -ball.dy;

    if(ball.x + ball.radius > player.x && ball.x <= player.x + player.w && ball.y + ball.radius >= player.y){
        ball.dy = -ball.dy
    };

    obstaculosarr.forEach((col) =>{
        col.forEach((obstaculo) => {
            if(obstaculo.visible === true){
                checkObstaculosCollision(obstaculo);
            }
        });
    });
}

function checkObstaculosCollision(obstaculo){
    if(ball.x >= obstaculo.x && ball.x + ball.radius <= obstaculo.x + obstaculo.w && ball.y + ball.radius >= obstaculo.y && ball.y <= obstaculo.y + obstaculo.h){
        ball.dy = -ball.dy;
        obstaculo.visible = false;

        obstaculoLength--;
        updatePontos();
    }
}

function updatePontos(){
    scorePontos.innerHTML = "";
    score++;
    scorePontos.innerHTML = score;

}

function checkPerdeu(){
    if(ball.y + ball.radius >= 530){
        alert('Você Perdeu!');
        location.reload();
        
    } 
}

function checkGanhou(){
    if(obstaculoLength <= 0){
        alert('Você Ganhou!');
        obstaculoLength = obstaculos.cols * obstaculos.rows;
        localStorage.reload();
    }
}

function update(){
    moverPlayer();
    moverBall();
    checkPerdeu();
    checkGanhou();
}



// ------ Render
function renderPlayer(){
    context.beginPath();

    context.rect(player.x, player.y, player.w, player.h);
    context.fillStyle = "black";
    context.fill();

    context.closePath();
}

function renderBall(){
    context.beginPath();

    context.arc(ball.x, ball.y, ball.radius, 0,2 * Math.PI);
    context.fillStyle = "black";
    context.fill();

    context.closePath();
}

function renderObstaculos(){
    obstaculosarr.forEach((col) => {
        col.forEach((obstaculo) => {
        context.beginPath();
        context.rect(obstaculo.x, obstaculo.y, obstaculo.w, obstaculo.h);
        context.fillStyle = obstaculo.visible ? "#9ed323" : "transparent";
        context.fill();
        context.closePath();

        })
       
    });
}

function render(){
    context.clearRect(0, 0, canvas.width, canvas.height);

    renderPlayer();
    renderBall();
    renderObstaculos();
    
}