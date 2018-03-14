function joueur(member, numero){
    this.guild;
    this.numero;
    this.member = member;
    this.carte;
    this.joined = false;
    this.mort = false;
    this.reveile = false;
    this.waitForCommand = false;
    this.liee = false;
    this.amoureux;
    this.avantPr;
    this.protege;
    this.pouvRenard = true;
    this.doitTuer = false;
    this.notdone = true;
    this.reveil = function(message){
        this.reveile = true;
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        switch(this.carte){
            case "Cupidon":
                //if(tour === 1 && this.notdone){
                    //if(!this.mort){
                        this.reveile = true;
                        if(!this.waitForCommand){
                            this.member.send('Vous êtes le cupidon ! Veuillez choisir 2 joueurs qui s’aimeront a la vie et la a mort,' + 
                            'en effet la mort de l’un entraine la mort de l’autre, (Vous pouvez vous désignez vous-même)' + 
                            'Fait !cupidon <joueur1> <joueur2> ');
                            this.waitForCommand = true;
                        }else{
                            if(command==="cupidon" && message.channel.type=="dm" && message.author.equals(this.member)){
                                var ind1 = memberByName(args[0]);
                                var ind2 = memberByName(args[1]);
                                if(ind1==-1 || ind2==-1){
                                    if(ind1==-1 && ind2==-1) this.member.send('aucun des deux pseudo n\'a été reconnu');
                                    else if(ind1==-1) this.member.send(args[0] + ' ne particpe pas au jeu ou n\'existe pas');
                                    else if(ind2==-1) this.member.send(args[1] + ' ne particpe pas au jeu ou n\'existe pas');
                                }else{
                                    joueurs[ind1].amoureux = joueurs[ind2].member;
                                    joueurs[ind2].amoureux = joueurs[ind1].member;
                                    joueurs[ind1].liee = true;
                                    joueurs[ind2].liee = true;
                                    this.member.send('Merci, vous pouvez vous rendormir');
                                    joueurs[ind1].member.send('Cupidon vous a désigner comme compagnons: ' + args[1]);
                                    joueurs[ind2].member.send('Cupidon vous a désigner comme compagnons: ' + args[0]);
                                    this.waitForCommand = false;
                                    this.reveile = false;
                                    Cupidon = true;
                                    this.notdone = false;
                                }
                            }
                        }
                    //}
                //}
            break;
            case "Salvateur":
                if(Cupidon && !this.mort){
                    this.reveile = true;
                    if(!this.waitForCommand){
                        this.member.send('qui veut tu proteger cette nuit? (!proteger <joueur>)');
                        this.waitForCommand = true;
                    }else{
                        if(command==="proteger" && message.channel.type=="dm" && message.author.equals(this.member)){
                            var ind = memberByName(args[0]);
                            if(ind==-1){
                                this.member.send('ce pseudo ne participe pas');
                            }else if(joueurs[ind].member.equals(this.avantPr)){
                                this.member.send('vous ne pouvez pas proteger une personne deux fois de suite');
                            }else{
                                joueurs[ind].protege = true;
                                this.member.send('vous avez choisis de proteger ' + args[0] + 'il ne mourra pas cette nuit');
                                this.avantPr = joueurs[ind];
                                this.reveile = false;
                                this.waitForCommand = false;
                                Salvateur = true;
                                Cupidon = false;
                            }
                        }
                    }
                }
            break;
            case "Loup garou":
                if(Salvateur && !this.mort){
                    this.reveile = true;
                    if(!this.waitForCommand){
                        this.member.send('vote pour celui que tu veux manger (!tuer pseudo)');
                        this.waitForCommand = true;
                    }else{
                        if(command==="tuer" && message.channel.type=="dm" && message.author.equals(this.member)){
                            var ind = memberByName(args[0]);
                            if(ind==-1){
                                this.member.send('ce pseudo ne participe pas');
                            }else if(joueurs[ind].mort){
                                this.member.send(args[0] + ' est deja mort, veuillez choisir qqn d\'autre');
                            }else{
                                this.member.send('vous avez choisis de tuer ' + args[0]);
                                if(joueurs[ind].protege){
                                    this.member.send('le salvateur a proteger ' + args[0] + 'durant ce tour, il ne mourra pas');
                                }else{
                                    if(joueurs[ind].carte == "Chasseuse"){
                                        joueurs[ind].doitTuer = true;
                                      this.waitForCommand = false;
                                      this.reveile = false;
                                      Salvateur = false;
                                      Loup = true;
                                    }
                                    joueurs[ind].mort = true;
                                    place.send(`${joueurs[ind].member} est mort`);
                                    if(joueurs[ind].liee){
                                        joueurs[ind].amoureux.mort = true;
                                        place.send(`${joueurs[ind].amoureux} etait son ame-soeur, il meurt aussi`);
                                    }
                                    this.waitForCommand = false;
                                    this.reveile = false;
                                    Salvateur = false;
                                    Loup = true;
                                }
                            }
                        }
                    }
                }
            break;
            case "Renard":
                if(Loup){
                    if(!this.mort && this.pouvRenard){
                        this.reveile = true;
                        if(!this.waitForCommand){
                            this.member.send('choisis trois personne, tu pourras voir leur cartes\n(!choisir <joueur1> <joueur2< <joueur3>)');
                            this.waitForCommand = true;
                        }else{
                            if(command==="choisir" && message.channel.type=="dm" && message.author.equals(this.member)){
                                var ind1 = memberByName(args[0]);
                                var ind2 = memberByName(args[1]);
                                var ind3 = memberByName(args[2]);
                                if(ind1==-1 || ind2==-1 || ind3==-1){
                                    this.member.send('l\'un des trois pseudo n\'a pas ete reconnue');
                                }else{
                                    this.member.send(
                                        args[0] + 'a la carte: ' + joueurs[ind1].carte +
                                        args[1] + 'a la carte: ' + joueurs[ind2].carte +
                                        args[2] + 'a la carte: ' + joueurs[ind3].carte);
                                    if(joueurs[ind1].carte =="Loup garou" || joueurs[ind2].carte =="Loup garou" || joueurs[ind3].carte =="Loup garou"){
                                        this.member.send('vous avez accuser a tort trois villageois vous ne pourrez plus utiliser votre pouvoir')
                                        this.pouvRenard = false;
                                    }
                                    this.waitForCommand = false;
                                    this.reveile = false;
                                }
                            }
                        }
                    }

                }
            break;
            case "Chasseuse":
                if(this.doitTuer){
                    if(!this.waitForCommand){
                        this.menber.send('vous etes mort, choisissez qui vous voulez emennez dans votre mort(!tuer <joueur>)');
                        this.waitForCommand = true;
                    }else{
                        if(command === "tuer" && message.channel.type=="dm" && message.author.equals(this.member)){
                            var ind = memberByName(args[0]);
                            if(ind==-1){
                                this.member.send('ce pseudo ne participe pas');
                            }else if(joueurs[ind].mort){
                                this.member.send(args[0] + ' est deja mort, veuillez choisir qqn d\'autre');
                            }else{
                                this.member.send('vous avez choisis de tuer ' + args[0]);
                                if(joueurs[ind].carte == "Chasseuse"){
                                    joueurs[ind].doitTuer = true;
                                }
                                joueurs[ind].mort = true;
                                place.send(`${joueurs[ind].member} est mort`);
                                if(joueurs[ind].liee){
                                    joueurs[ind].amoureux.mort = true;
                                    place.send(`${joueurs[ind].amoureux} etait son ame-soeur, il meurt aussi`);
                                }
                                this.waitForCommand = false;
                                this.doitTuer = false;
                            }
                        }
                    }
                }
            break;
        }
    }
    this.tuer = function(joueur){
        if(!joueur.protege){
            joueur.mort = true;
            if(joueur.carte == "Chasseuse"){
                joueur.doitTuer = true;
            }
            if(joueur.liee){
                joueur.tuer(joueur.amoureux);
            }
        }
    }
}



var Names = [
    "Villageoise",
    "Cupidon",
    "Voyante",
    "Chasseuse",
    "Loup garou",
    "Sorciere",
    "Idiot"
];

var decks = [
    [],
    [],
    [],
    /*['Loup garou', 'Idiot', 'Villageoise', 'Chasseuse']*/['Loup garou', 'Cupidon', 'Villageoise', 'Villageoise'],
    [],
    ['Loup garou', 'Cupidon', 'Renard', 'Chasseuse', 'Salvateur', 'Villageoise']
]
const Discord = require("discord.js");

const client = new Discord.Client();

//const config = require("./config.json");

//const token = config.token;
//const prefix = config.prefix;

const token = process.env.TOKEN;
const prefix = process.env.PREFIX;


var startJoin = false;
var startGame = false;

var joueurs = [];

//var joined = [];
//var cartes = [];

//var fall = client.fetchUser('name', 'Fall189');

var Cupidon = false;
var Salvateur = false;
var Loup = false;

var nuit = false;

var tour = 0;

var guild;
var place;
var village;

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  client.user.setActivity(`on ${client.guilds.size} servers`);
});

client.on("message", async message => {
    if (message.author.bot) return;

    if (message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if(command === "ping"){
        //message.author.send(`${fall}`);
    }
    if(command === "jouer" && args[0] === "-Chrom-Garou-" && message.channel.type === "text"){
        if(!startJoin){
            guild = message.guild;
            place = guild.channels.find('name', 'place-du-village');
            message.channel.send("Une partie commence veuillez rejoindre la partie avec ( !rejoindre garou )");
            startJoin = true;
        }
    }
    if(command==="rejoindre" && args[0]==="garou" && guild === message.guild && message.channel.type === "text"){
        if(startJoin){
            joueurs[joueurs.length] = new joueur(message.author, joueurs.length);
            //joined[joined.length] = message.author;
            var m = "joined: ";
            for(var i = 0;i<joueurs.length;i++){
                m += joueurs[i].member.username + ', '; 
            }
            message.channel.send(m);
            console.log(joueurs.length);
        }
    }
    if(command==="quitter" && args[0]==="garou" && guild === message.guild && message.channel.type === "text"){
        var n = matchMember(message.author);
        if(startJoin && n!=-1){
            joueurs[n].joined = false;
            joueurs.splice(n, 1);
            var m = "joined: ";
            for(var i = 0;i<joueurs.length;i++){
                m += `${joueurs[i].member}, `; 
            }
            message.channel.send(m);
        }
    }
    if(command === "go" && guild === message.guild && message.channel.type === "text"){
        if(startJoin && joueurs.length>=4 && !startGame){
            village = joueurs[Math.floor(Math.random()*joueurs.length)].member;
            message.channel.send("la partie va commencer");
            var m ='les joueurs sont: ';
            for(var i = 0;i<joueurs.length;i++){
                m += `${joueurs[i].member}, `; 
            }
            message.channel.send(m);
            message.channel.send('les cartes vont etre distribuées');
            var temp = shuffle(decks[joueurs.length-1]);
            for(i=0;i<joueurs.length;i++){
                joueurs[i].carte = temp[i];
                joueurs[i].member.send("Les cieux ont décidé que pour cette vie tu seras : " + joueurs[i].carte);
            }
            var taa = indexOfLoup();
            for(i=0;i<joueurs.length;i++){
                if(joueurs[i].carte==="Loup garou"){
                    var mm = 'les loups de cette partie sont: ';
                    for(var j = 0;j<taa.length;j++){
                        mm+=joueurs[taa[j]].member.username + ', ';
                    }
                    joueurs[i].member.send(mm);
                }
            }
            //message.guild.createChannel("le_gang_des_loups", "text");
            /*var cha = message.guild.createChannel('', 'text');
            cha.setParent('419857862823641090');*/
            message.channel.send(`Etes-vous prêt à commencer une aventure étrange  dans le village de ${village}`);
            message.channel.send(`Les commandes de votes en journée sont a faire ici #place-du-village`);
            startGame=true;
            nuit = true;
            tour = 1;
        }
    }
    if(nuit){
        if(tour==1 && !Cupidon){
            var ind = indexOfC("Cupidon");
            if(ind==-1){
                Cupidon = true;
            }else{
                for(var j = 0;j<ind.length;j++){
                    if(!joueurs[ind[j]].mort){
                        joueurs[ind[j]].reveil(message);
                    }
                }
            }
        }else if(Cupidon && !Salvateur){
            var ind = indexOfC("Salvateur");
            if(ind==-1){
                Salvateur = true;
            }else{
                for(var j = 0;j<ind.length;j++){
                    if(!joueurs[ind[j]].mort){
                        joueurs[ind[j]].reveil(message);
                    }
                }
            }
        }else if(Salvateur && !Loup){
            var ind = indexOfC("Loup garou");
            if(ind==-1){
                Loup = true;
            }else{
                for(var j = 0;j<ind.length;j++){
                    if(!joueurs[ind[j]].mort){
                        joueurs[ind[j]].reveil(message);
                    }
                }
            }
        }else if(Loup && !Renard){
            var ind = indexOfC("Renard");
            if(ind==-1){
                Renard = true;
            }else{
                for(var j = 0;j<ind.length;j++){
                    if(!joueurs[ind[j]].mort){
                        joueurs[ind[j]].reveil(message);
                    }
                }
            }
        }
    }else{

    }

});
client.login(token);

function shuffle(arra1) {
    var ctr = arra1.length, temp, index;

// While there are elements in the array
    while (ctr > 0) {
// Pick a random index
        index = Math.floor(Math.random() * ctr);
// Decrease ctr by 1
        ctr--;
// And swap the last element with it
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}
function indexOfC(name){
    var tab = [];
    for(var i = 0;i<joueurs.length;i++){
        if(joueurs[i].carte==name){
            tab[tab.length]=i;
        }
    }
    if(tab.length==0){
        return -1;
    }else{
        return tab;
    }
}
function matchMember(member){
    for(var i=0;i<joueurs.length;i++){
        if(member.equals(joueurs[i].member)){
            return i;
        }
    }
    return -1;
}

function indexOfLoup(){
    var tab = [];
    for(var i=0;i<joueurs.length;i++){
        if(joueurs[i].carte == "Loup garou"){
            tab[tab.length] = i;
        }
    }
    return tab;
}
function memberByName(name){
    for(var i=0;i<joueurs.length;i++){
        if(joueurs[i].member.username==name){
            return i;
        }
    }
    return -1;
}
