const fs = require('fs');
const os = require('os');
const bulletStore = os.homedir() + "/.goc/bullets";
const R = require('ramda');

function Gun() {
    const load = () => {
        if (fs.existsSync(bulletStore)) {
            return JSON.parse(fs.readFileSync(bulletStore, 'utf8'));
        } else {
            return [];
        }
    };

    let bullets = load();

    this.empty = () => {
       bullets = [];
    };

    this.fire = (text, id) => {
        const bullet = bullets.length + 1;
        console.log("[" + bullet.toString().yellow + "] " + text);
        bullets.push(id);
    };

    this.examine = R.cond([
        [parseInt, R.pipe(parseInt, (i) => R.nth(i - 1, bullets))],
        [R.T, R.identity]]);

    this.save = () => fs.writeFileSync(bulletStore, JSON.stringify(bullets), { encoding: 'utf8' });
}

module.exports = new Gun();