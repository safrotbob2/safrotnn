async function handler(m, {usedPrefix, command}) {
  const datas = global
  const idioma = datas.db.data.users[m.sender].language
  const _translate = JSON.parse(fs.readFileSync(`./language/${idioma}.json`))
  const tradutor = _translate.plugins.anonymous_chat

  command = command.toLowerCase();
  this.anonymous = this.anonymous ? this.anonymous : {};
  switch (command) {
    case 'التالي':
    case 'اخرج-بانشات': {
      const room = Object.values(this.anonymous).find((room) => room.check(m.sender));
      if (!room) return this.sendMessage(m.chat, {text: `إنت مش في شات مجهول. استخدم ${usedPrefix}ابدأ علشان تبدأ.`}, {quoted: m});
      m.reply("تم الخروج من الشات المجهول.");
      const other = room.other(m.sender);
      if (other) await this.sendMessage(other, {text: `الشخص التاني خرج من الشات المجهول. استخدم ${usedPrefix}ابدأ علشان تبدأ شات جديد.`}, {quoted: m});
      delete this.anonymous[room.id];
      if (command === 'اخرج-بانشات') break;
    }
    case 'بانشات': {
      if (Object.values(this.anonymous).find((room) => room.check(m.sender))) return this.sendMessage(m.chat, {text: `إنت لسه في شات مجهول. لو عايز تخرج استخدم ${usedPrefix}اخرج.`}, {quoted: m});
      const room = Object.values(this.anonymous).find((room) => room.state === 'WAITING' && !room.check(m.sender));
      if (room) {
        await this.sendMessage(room.a, {text: "في شخص انضم للشات المجهول، ممكن تبدأوا الدردشة."}, {quoted: m});
        room.b = m.sender;
        room.state = 'CHATTING';
        await this.sendMessage(m.chat, {text: `ممكن تضغط ${usedPrefix}التالي لو عايز تروح لشات تاني.`}, {quoted: m});
      } else {
        const id = + new Date;
        this.anonymous[id] = {
          id,
          a: m.sender,
          b: '',
          state: 'WAITING',
          check: function(who = '') {
            return [this.a, this.b].includes(who);
          },
          other: function(who = '') {
            return who === this.a ? this.b : who === this.b ? this.a : '';
          },
        };
        await this.sendMessage(m.chat, {text: `مستني حد ينضم علشان تبدأ الشات. لو عايز تخرج استخدم ${usedPrefix}اخرج.`}, {quoted: m});
      }
      break;
    }
  }
}
handler.help = ['بانشات', 'اخرج-بانشات', 'التالي'];
handler.tags = ['anonymous'];
handler.command = ['بانشات', 'اخرج-بانشات', 'التالي'];
handler.private = true;
export default handler;
