const { Client, Collection, Intents, MessageActionRow, MessageButton } = require('discord.js');
const config = require(`./config.json`);
let cpuStat = require("cpu-stat");
const mongoose = require("mongoose");
const db = require("quick.db");
const moment = require('moment')
const Discord = require('discord.js');

const client = new Client({
    intents: [
        "GUILDS",
        "GUILD_MEMBERS",
        "GUILD_BANS",
        "GUILD_INTEGRATIONS",
        "GUILD_WEBHOOKS",
        "GUILD_INVITES",
        "GUILD_VOICE_STATES",
        "GUILD_PRESENCES",
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_MESSAGE_TYPING",
        "DIRECT_MESSAGES",
        "DIRECT_MESSAGE_REACTIONS",
        "DIRECT_MESSAGE_TYPING",
    ],
});

require('dotenv').config()

module.exports = client;

client.discord = Discord;
client.commands = new Collection();
client.slashCommands = new Collection();

require("./src/handler")(client);

client.login(process.env.TOKEN);

client.on("interactionCreate", interaction => {
  let button = new Discord.MessageButton()
      .setCustomId("bhfd")
      .setLabel("Atualizar Ping")
      .setStyle("SECONDARY")

  if (interaction.isButton()) {
      if (interaction.customId.startsWith("bhfd")) {

          interaction.reply({ content: `${interaction.user} Meu ping atualizado está em \`${client.ws.ping}ms\`.`, ephemeral: true })
      }
  }
})



client.on("message", message => {
  if (message.author.bot) return;
  if (message.channel.type == 'ferinha')
      return
  if (message.content == `<@${client.user.id}>` || message.content == `<@!${client.user.id}>`) {
      if (message.content) {

          let quem = new Discord.MessageEmbed()
          .setTitle(`Quem é FyreX?`)
              .setDescription(`Olá **${message.author}**, meu nome é **FyreX**, estou aqui para ajudar!\nSaiba mais sobre mim com \`/ajuda\`.\nuse \`/sugerir\` para enviar sugestoes ao meu dono.`)
              .setColor("#36393e")
              
               let botao = new Discord.MessageActionRow()
          .addComponents(
              new Discord.MessageButton()
              .setLabel("Servidor de Suporte")
              .setEmoji('<:fyrexbot:981215083776585769>')
              .setStyle("LINK")
              .setURL(`https://discord.gg/eaYdnpzDd6`),

              new Discord.MessageButton()
              .setLabel("Me Adicione")
               .setEmoji(`<:fyrexconfig:981215083738857574>`) // por um emoji do seu gosto
              .setStyle("LINK")
              .setURL(`https://discord.com/api/oauth2/authorize?client_id=981232810012581918&permissions=8&scope=bot%20applications.commands`)
          );
              
              message.reply({ embeds: [quem], components: [botao] })


      };
  }
});

client.on('message', message => {
  if (message.author.bot) return;
  if (message.channel.type == 'dm') return;
  if (!message.content.toLowerCase().startsWith(config.prefix.toLowerCase())) return;
  if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) return;

  const args = message.content
      .trim().slice(config.prefix.length)
      .split(/ +/g);
  const command = args.shift().toLowerCase();




  try {
      const commandFile = require(`./commands/${command}.js`)
      commandFile.run(client, message, args);

  } catch (err) {


      let prefixo_bruno = config.prefix;
      let comando_inexistente = `${prefixo_bruno}${command}`;

      if (comando_inexistente) {
          message.reply({
              embeds: [
                  new Discord.MessageEmbed()
                      .setTitle(`<:fyrexx:981215084393140235> Algo deu errado!`)
                      .setDescription(`Não consegui executar esse comando, talvez ele ainda não tenha sido feito.\nVeja meus comandos completos com **${config.prefix}ajuda**.`)
                      .setColor(`#36393e`)
              ]

          }

          )
      };



      console.error('Erro:' + err);
  }
});

  client.on("ready", () => {
    let activities = [
        `🛠️ FyreX`,
      `🌐 ${client.guilds.cache.size} servidores!`,
      `⚙️ ${client.channels.cache.size} canais!`,
      `👥 ${client.users.cache.size} usuários!`,
      `🔔 Utilize ${config.prefix}ajuda`,
      `By ! Bruno#1761`,
      `❤️ Meu servidor`,
      `❤️ ${config.prefix}invite`,
      `💎 Todos vocês`,
      `❤️ Obrigado pelo uso!`,
      'FyreX Community',
        'https://discord.gg/BFj2JAAf',
    ];
    i = 0;
    setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]}`, {
        type: "STREAMING", url: "https://discord.gg/BFj2JAAf"
    }), 5000);
    client.user
        .setStatus("dnd")
});

  client.on('interactionCreate', interaction => {

    let criar = new Discord.MessageButton().setCustomId("c").setLabel("Crie seu ticket").setStyle("PRIMARY")
    let fechar = new Discord.MessageButton().setCustomId("f").setLabel("Feche seu ticket").setStyle("DANGER").setEmoji(`<:fyrexporta:981216645697646622>`)



    if (interaction.isButton()) {
        if (interaction.customId.startsWith('c')) {
                              db.add(`ticketcount_${interaction.guild.id}`, 1);
                              db.add(`ticketaberto_${interaction.guild.id}`, 1);
            let ticketcount = db.get(`ticketcount_${interaction.guild.id}`);
                    

            let achando = interaction.guild.channels.cache.find(a => a.name === `00${ticketcount}-${interaction.member.user.tag}`);


            if (achando) return interaction.reply({ content: `**\❌ ${interaction.user} Você já possui um ticket aberto: ${achando}**`, ephemeral: true })

            interaction.guild.channels.create(`00${ticketcount}-${interaction.member.user.tag}`, {
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: ["VIEW_CHANNEL"],
                    },
                    {
                        id: interaction.user.id,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", 'READ_MESSAGE_HISTORY']
                    }
                ],

            }).then(async channel => {


                let bruno = new Discord.MessageEmbed()
                    .setDescription(`Seu ticket foi criado em: ${channel}`)
                    .setColor("#36393e")

                let brunin = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setLabel("Ir para o canal")
                            .setEmoji('<:fyrexporta:981216645697646622>')
                            .setStyle("LINK")
                            .setURL(`https://discord.com/channels/${interaction.guild.id}/${channel.id}`)
                    );
                interaction.reply({ embeds: [bruno], components: [brunin], ephemeral: true })




                const row = new Discord.MessageActionRow().addComponents(fechar)

                let embed = new Discord.MessageEmbed()
                    .setTitle(`Ticket`)
                    .setDescription(`**Olá${interaction.user} Bem vindo, ao ticket\n\nUsamos essa função para te orientar e ajudar quando você está com duvida sobre determinado assunto, lembre-se de ser preciso sobre o que precisa (Não é somente você que utiliza desta função então não spame)**`)
                    .setColor("#36393e")

                channel.send({ content: `${interaction.user}`, embeds: [embed], components: [row] }).then(msg => {
                    msg.pin()
                })
            })
        }
        if (interaction.customId.startsWith('f')) {
            db.subtract(`ticketaberto_${interaction.guild.id}`, 1);

            interaction.reply(`**\🔒 ${interaction.user} Seu ticket será fechado em 5 segundos.**`)

            setTimeout(() => {

                try {

                    interaction.channel.delete()

                }
                catch (er) {
                    console.log(er)
                }

            }, 5000)

        }
    }
})

                    
    


client.on('message', message => {
  const ab = "🏙️ Bom Dia, Tudo Bem? ☀️"

  if (message.content.startsWith("bom dia")) {
      return message.reply(ab)

  }
})

client.on('message', message => {
  const ab = "🏙️ Bom Dia, Tudo Bem? ☀️"

  if (message.content.startsWith("Bom dia")) {
      return message.reply(ab)

  }
})


//RESPONDER MENSAGEM - BOA TARDE
client.on('message', message => {
  const ab = "🌆 Boa Tarde, Tudo Bem? 🌔"

  if (message.content.startsWith("boa tarde")) {
      return message.reply(ab)

  }
})

client.on('message', message => {
  const ab = "🌆 Boa Tarde, Tudo Bem? 🌔"

  if (message.content.startsWith("Boa tarde")) {
      return message.reply(ab)

  }
})


//RESPONDER MENSAGEM - BOA NOITE
client.on('message', message => {
  const ab = "🌃 Boa noite, Tudo bem?🌙"

  if (message.content.startsWith("boa noite")) {
      return message.reply(ab)

  }
})

client.on('message', message => {
  const ab = "🌃 Boa noite, Tudo bem?🌙"

  if (message.content.startsWith("Boa noite")) {
      return message.reply(ab)

  }
})















client.on("messageDelete", async (message) => {

    let channelDellogs = db.get(`channelLogs_${message.guild.id}`);
    if (channelDellogs === null) return;

    if (message.author.bot) return;

    let user1 = message.author;
    let channel2 = message.channel;
    let msgDelete = message.content;

    let embed = new Discord.MessageEmbed()
        .setTitle(`🗑 Mensagem excluída`)
        .setColor(`#36393e`)
        .addFields(
            {
                name: `Autor da mensagem:`,
                value: `${user1}`,
                inline: false,
            },

        )
        .addFields(
            {
                name: `Canal:`,
                value: `${channel2}`,
                inline: false,
            },
        )
        .addFields(
            {
                name: `Mensagem:`,
                value: `\`\`\`${msgDelete}\`\`\``,
                inline: false,
            }
        )
        .setTimestamp()
        .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));

    try {

        message.guild.channels.cache.get(channelDellogs).send({ embeds: [embed] })

    } catch (e) { }
});

client.on("messageUpdate", async (message, oldMessage) => {

    let setlogsmsgenv = db.get(`channelLogseditmsg_${message.guild.id}`);
    if (setlogsmsgenv === null) return;

    if (message.author.bot) return;

    let msgchannel = message.channel;
    let msgantiga = message.content;
    let msgeditada = oldMessage.content;

    let embed = new Discord.MessageEmbed()
        .setTitle(`📝 Mensagem editada`)
        .setColor(`#36393e`)
        .addFields(
            {
                name: `Autor da mensagem`,
                value: `${message.author}`,
                inline: false,
            },
        )

        .addFields(
            {
                name: `Canal`,
                value: `${msgchannel}`,
                inline: false,
            },
        )
        .addFields(
            {
                name: `Mensagem antiga`,
                value: `\`\`\`${msgantiga}\`\`\``,
                inline: false
            },
        )
        .addFields(
            {
                name: `Mensagem editada`,
                value: `\`\`\`${msgeditada}\`\`\``,
                inline: false,
            }
        )
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })

    message.guild.channels.cache.get(setlogsmsgenv).send({ embeds: [embed] })
});



client.on('guildMemberAdd', async (member) => {

    let canalboa = db.get(`boasvindachannel_${member.guild.id}`)
    let role = db.get(`autorole_${member.guild.id}`)
    if (canalboa === null) return;
    if (role === null) return;

    let brunocargos = db.get(`autorole_${member.guild.id}`);
    if (!brunocargos === null) return;
    member.roles.add(brunocargos)

    let embed = new Discord.MessageEmbed()
        .setDescription(`Ola ${member.user}, seja bem vindo(a) ao servidor \`${member.guild.name}\`!`)
        .setColor('#36393e')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setAuthor({ name: `Bem Vindo!`, iconURL: member.guild.iconURL({ dynamic: true }) })

    member.guild.channels.cache.get(canalboa).send({ content: `${member.user}`, embeds: [embed] }).catch(e => { })

})

client.on('guildMemberRemove', async (member) => {

    let canalsaiu = db.get(`canalsaida_${member.guild.id}`)
    if (canalsaiu === null) return;

    let embed = new Discord.MessageEmbed()
        .setDescription(`O membro ${member.user} saiu do servidor.`)
        .setColor('#36393e')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setAuthor({ name: `Saiu!`, iconURL: member.guild.iconURL({ dynamic: true }) })

    member.guild.channels.cache.get(canalsaiu).send({ content: `${member.user}`, embeds: [embed] }).catch(e => { })

})






client.on('messageCreate', async (message) => {

    if (message.author.bot) return;
    if (message.channel.type == 'dm') return;

    let verificando = db.get(`antilink_${message.guild.id}`);
    if (!verificando || verificando === "off" || verificando === null || verificando === false) return;

    if (verificando === "on") {

        if (message.member.permissions.has("MANAGE_GUILD")) return;
        if (message.member.permissions.has("ADMINISTRATOR")) return;

        if (message.content.includes("https".toLowerCase() || "http".toLowerCase() || "www".toLowerCase() || ".com".toLowerCase() || ".br".toLowerCase())) {

        message.delete();

        let jdsfnasdkhfbshdafbsh = new Discord.MessageEmbed()
        .setAuthor({ name: "Antilinks!"})
            .setColor(`#36393e`)
            .setDescription(`<:fyrexerrorr:981376761696768000> Ops... ${message.author} Você nao pode enviar links aqui.`);

        message.channel.send({embeds: [jdsfnasdkhfbshdafbsh]})

        }


    }

})





client.on("guildCreate", async (guild) => {
    
    const fetchedLogs = await guild.fetchAuditLogs({
      limit: 1,
      type: 'BOT_ADD'
    })
    const addAuthorLog = fetchedLogs.entries.first();
    const { executor, target } = addAuthorLog;

    const embed = new Discord.MessageEmbed()
                    .setTitle(`Obrigado!`)
                    .setDescription(`Olá ${executor.tag}, muito obrigado por me adicionar no servidor \`${guild.name}\`.\nEntre no meu servidor de suporte para tirar qualquer duvida!`)
                    .setColor("#36393e")  

                    let aindinadinsindiasdsndjnas = new Discord.MessageActionRow()
          .addComponents(
              new Discord.MessageButton()
              .setLabel("Servidor Suporte")
              .setEmoji('<:fyrexconfig:981215083738857574>')
              .setStyle("LINK")
              .setURL(`https://discord.gg/eaYdnpzDd6`),
          );
    
    executor.send({embeds: [embed], components: [aindinadinsindiasdsndjnas]})
   
})





client.on('guildCreate', function(guild) {
    var channel = client.channels.cache.get('981062376273088542');
	var owner = guild.ownerId;

	const embed =  new Discord.MessageEmbed()
		.setColor(`#00cef5`)

		.setTitle(`Fui Adicionado!`)

        .setDescription(`\`Dono:\` <@${owner}>`)

		.addField(`\`Nome do servidor:\``, `**${guild.name}**`, false)

		.addField(`\`ID do servidor\``, `**${guild.id}**`, false)

		.addField(`\`Quantidade de membros:\``, `**${guild.memberCount}**`, false)

		.addField(`\`Total De Canais:\``, `**${guild.channels.cache.size}**`, false)

		.addField(`\`Total de servidores:\``, `**${client.guilds.cache.size}**`, false)

		.setTimestamp();

    channel.send({ embeds: [embed] });
});

// QUANDO É REMOVIDO DE UM SERVIDOR
client.on('guildDelete', function(guild) {
	var channel = client.channels.cache.get('981062376273088542');
	var owner = guild.ownerId;

	const embed =  new Discord.MessageEmbed()
		.setColor(`#00cef5`)


		.setTitle(`Fui Removido!`)

        .setDescription(`\`Dono:\` <@${owner}>`)

		.addField(`\`Nome do servidor:\``, `**${guild.name}**`, false)

		.addField(`\`ID do servidor\``, `**${guild.id}**`, false)

		.addField(`\`Quantidade de membros:\``, `**${guild.memberCount}**`, false)

		.addField(`\`Total De Canais:\``, `**${guild.channels.cache.size}**`, false)

		.addField(`\`Total de servidores agora:\``, `**${client.guilds.cache.size}**`, false)

		.setTimestamp();

    channel.send({ embeds: [embed] });
});





















client.on("guildMemberAdd", (member) => {
    let id = db.get(`contador_${member.guild.id}`);
    let canal = member.guild.channels.cache.get(id);
    if (!canal) return;

    let membros = member.guild.memberCount;
    canal.setName(`👥 Membros: ${membros}`)
})
client.on("guildMemberRemove", (member) => {
    let id = db.get(`contador_${member.guild.id}`);
    let canal = member.guild.channels.cache.get(id);
    if (!canal) return;

    let membros = member.guild.memberCount;
    canal.setName(`👥 Membros: ${membros}`)
})

client.on("guildMemberAdd", (member) => {
    let id = db.get(`contadorcall_${member.voice.channel}`);
    let canalcall = member.guild.channels.cache.get(id);
    if (!canalcall) return;

    let membroscall = member.voice.channel;
    canalcall.setName(`👥 Em Call: ${membroscall}`)
})
client.on("guildMemberRemove", (member) => {
    let id = db.get(`contadorcall_${member.voice.channel}`);
    let canalcall = member.guild.channels.cache.get(id);
    if (!canalcall) return;

    let membroscall = member.voice.channel;
    canalcall.setName(`👥 Em Call: ${membroscall}`)
})























client.on("message", async message => {

    let afk = new db.table("AFKs"),
          authorStatus = await afk.fetch(message.author.id),
          mentioned = message.mentions.members.first();
      
      if (mentioned) {
        let status = await afk.fetch(mentioned.id);
        
        if (status) {

            const embedhavgg = new Discord.MessageEmbed()
            .setColor(`#36393e`)
            .setTitle(`Afk!`)
            .setDescription(`O Usúario **${mentioned.user.tag}** está AFK \nMotivo: **${status}**`)
          message.reply({embeds: [embedhavgg]})
        }
      }
      
      if (authorStatus) {
        const asndjk78njkasd8 = new Discord.MessageEmbed()
        .setColor(`#36393e`)
        .setTitle(`Afk!`)
        .setDescription(`\`${message.author.tag}\` O sistema de afk foi desativado!\nVocê não está mais em afk.`)

        message.reply({embeds: [asndjk78njkasd8]})
        afk.delete(message.author.id)
      }
    })






    client.on('interactionCreate', interaction => {

        let cargo = db.get(`verificar_${interaction.guild.id}`);
    if (!cargo === null) return;
    
        if (interaction.isButton()) {
            if (interaction.customId.startsWith("botao_cargo")) {
                try {
    
                    if (interaction.member.roles.cache.get(cargo)) {
    
                        interaction.reply({ content: `\\❌ Você já está verificado no servidor.`, ephemeral: true })
    
                    } else {
    
                        interaction.member.roles.add(cargo)
                        interaction.reply({ content: `\\✅ Você foi verificado com sucesso.`, ephemeral: true })
    
                    }
                } catch (er) { console.log(er) }
            } else { }
    
        }
    
    })


