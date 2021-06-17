const canvas = document.querySelector('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;
const c = canvas.getContext('2d');
const scoreval=document.querySelector('#scoreval');
const energyval = document.querySelector('#energyval');
var score = 0;
var energy = 100;
const startgamebtn = document.querySelector('#startgamebtn');
const scorecard = document.querySelector('#scorecard');
const scorecardval = document.querySelector('#scorecardval');
class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();

    }
}
class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();

    }
    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}
class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();

    }
    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}
const friction = 0.99;
class Particles {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }
    draw() {
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.restore();

    }
    update() {
        this.draw();
        this.velocity.x *=friction;
        this.velocity.y *=friction; 
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha-=0.01;
    }
}


var myvar1;
var myvar2;



function spawnenemies() {

   myvar1 =  setInterval(() => {
        let radius = Math.random() * 30;

        if (radius < 15) {

            radius = 15;

        }

        let x;
        let y;
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        }
        else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }

        const color = `hsl(${Math.random() * 360},50%,50%)`;
        const a = canvas.width / 2;
        const b = canvas.height / 2;
        const angle = Math.atan2(b - y, a - x);



        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        enemies.push(new Enemy(x, y, radius, color, velocity));


    }, 1000);
    myvar2 = setInterval(() => {
        let radius = Math.random() * 60;

        if (radius < 15) {

            radius = 15;

        }

        let x;
        let y;
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        }
        else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }

        const color = `hsl(${Math.random() * 360},50%,50%)`;
        const a = canvas.width / 2;
        const b = canvas.height / 2;
        const angle = Math.atan2(b - y, a - x);



        const velocity = {
            x: Math.cos(angle)*1.2,
            y: Math.sin(angle)*1.2
        }
        enemies.push(new Enemy(x, y, radius, color, velocity));

    
    }, 20000);


}


const x = canvas.width / 2;
const y = canvas.height / 2;


let player = new Player(x, y, 15, "white");
let projectiles = [];
let particles = [];
let enemies = [];



let animationid;
var collisonsound = new Audio('explosion_sound.wav');
var gameover_sound = new Audio('gameover_sound.mp3');

function animate() {
    animationid = requestAnimationFrame(animate);
   
   
    c.fillStyle = "rgba(0,0,0,0.1)";
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();
   

    projectiles.forEach((projectile, projectileindex) => {

        projectile.update();
        let distance1 = (projectile.x - projectile.radius);
        let distance2 = (projectile.y - projectile.radius);
        


        //  Removing the projectile from projectiles array after it gone offscreen..
        if (distance1 < 0 || distance2 < 0) {

            projectiles.splice(projectileindex, 1);

        }


    })
    enemies.forEach((enemy, enemyindex) => {
        enemy.update();
        projectiles.forEach((projectile, projectileindex) => {
            const dist = Math.hypot((enemy.x - projectile.x), (enemy.y - projectile.y));



            //  When projectiles hits the enemy..
            if ((dist - (enemy.radius + projectile.radius)) < 1) {

                //  Creating particles on explosion..
                for (let i = 0; i < enemy.radius; i++) {
                    particles.push(new Particles(enemy.x, enemy.y, Math.random()*3, enemy.color, {
                        x: (Math.random() - 0.5)*(Math.random()*5),
                        y: (Math.random() - 0.5)*(Math.random()*5),

                    }))
                    collisonsound.play();
                   
                }

                
               
                
                if (enemy.radius > 15) {
                    //  increase the score when enemy shrinks..
                    score+=5;
                    scoreval.innerHTML = score;
                    gsap.to(enemy, {
                        radius: enemy.radius - 10,
                    })
                    projectiles.splice(projectileindex, 1);


                }
                else {
                    // Bonus score for removing enemy completely from the screen..
                    score+=10;
                    scoreval.innerHTML = score;
                    enemies.splice(enemyindex, 1);
                    projectiles.splice(projectileindex, 1);
                }
                
            }

        })
        let game_end_dist = ((Math.hypot(player.x - enemy.x, player.y - enemy.y) - (enemy.radius + player.radius)));
          
        // console.log(game_end_dist);
        if (game_end_dist <= 0 && game_end_dist >=-1) {
    
          
            var energysound = new Audio('collision_sound.wav');
           
            energysound.play();
            // decrease the energy-level when enemy hits the player..
            energy-=enemy.radius;

            energy = parseInt(Math.max(energy,0));
            energyval.innerHTML = energy;
          
            
            if(energy===0){
                cancelAnimationFrame(animationid);
                gameover_sound.play();
                scorecardval.innerHTML = score;
                scorecard.style.display = 'flex';

            }
        

        }

      
    })
    enemies.forEach((enemy,index)=>{
        let d = ((Math.hypot(player.x - enemy.x, player.y - enemy.y) - (enemy.radius + player.radius)));
        if(d<=-1){
               enemies.splice(index,1);
        }
    })
    particles.forEach((particle,index)=>{
        if(particle.alpha<=0){
              particles.splice(index,1);
        }
        else{
         particle.update();
        } 
    })

}


addEventListener('click', (event) => {
    
    const audio = new Audio('gun_sound.mp3');
    audio.play();
    const angle = Math.atan2(event.clientY - y, event.clientX - x);
    //  atan2() returned counter clockwise angle in radians;
    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    }

    projectiles.push(
        new Projectile(x, y, 5, "white", velocity)
    )
   

})
function init(){
    clearInterval(myvar1);
    clearInterval(myvar2);
    player = new Player(x, y, 15, "white");
    projectiles = [];
    particles = [];
    enemies = [];
    score = 0;
    energy = 100;
    scoreval.innerHTML = score;
    energyval.innerHTML = energy;
    scorecardval.innerHTML = score;
    gameover_sound.pause();
    animate();
    spawnenemies();
    scorecard.style.display = 'none';
    

}
startgamebtn.addEventListener('click',()=>{
    init();

})

