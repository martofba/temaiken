const { Client, GatewayIntentBits } = require('discord.js');
const config = require('./config'); // Importa tu archivo de configuración
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // Acceso a información de servidores
        GatewayIntentBits.GuildMessages, // Acceso a mensajes en servidores
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const prefix = '/';

client.on('ready', () => {
    console.log(`Bot conectado como ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {

    if (!message.content.startsWith(prefix) || message.author.bot) return; // si no empieza con el prefijo o si el mensaje vino de otro bot, rechaza

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'chau') {
        // Verifica si el autor del mensaje es un administrador o tiene permisos adecuados
        if (message.member.permissions.has('ADMINISTRATOR')) {
            message.reply('Nos vemos loro...'); // Respuesta al usuario
            client.destroy(); // Desconecta al bot
        } else {
            message.reply('No tienes permisos para desconectar al bot.'); // Respuesta si no tiene permisos
        }
    }
    if (message.guild) {
        // Mensaje en un canal de texto
        // Tu lógica para comandos en canales de texto
        if (command === 'hola') {
            message.reply('¡Hola ' + message.member.displayName + ' gato!');
        }

        if (command === 'temaiken') {
            // Obtén el enlace del video de YouTube desde los argumentos
            const videoLink = args[0];
            if (!videoLink) {
                message.reply('Por favor proporciona un enlace de YouTube válido.');
                return;
            }

            // Reproduce el audio del video
            const voiceChannel = message.member.voice.channel;
            if (!voiceChannel) {
                message.reply('Debes estar en un canal de voz para usar este comando.');
                return;
            }

            try {
                //const connection = await voiceChannel.join();
                const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator,
                });

                // Crea un reproductor de audio
                const player = createAudioPlayer();

                // Conecta el reproductor a la conexión de voz
                connection.subscribe(player);


                // Opciones para la descarga (establece el bitrate deseado)
                const options = {
                    filter: 'audioonly',
                    quality: 'highest', // Calidad de audio (puedes ajustarla según tus preferencias)
                    // Otros parámetros opcionales aquí...
                };

                // Crea un recurso de audio (reemplaza 'stream' con tu fuente de audio)
                const stream = ytdl(videoLink, options);
                const resource = createAudioResource(stream);

                // Suscribe el reproductor al recurso de audio
                player.play(resource);

                message.reply('Reproduciendo audio en el canal de voz.');

            } catch (error) {
                console.error(error);
                message.reply('Ocurrió un error al reproducir el audio.');
            }
        }

    } else {
        // Mensaje directo
        // Tu lógica para comandos en mensajes directos
        if (command === 'holi') {
            message.reply('¡Hola! Gato');
        }
    }


});

client.login(config.discordToken); // Inicia sesión con el token del bot
