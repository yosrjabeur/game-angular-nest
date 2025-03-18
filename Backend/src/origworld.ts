import { RatioType } from './graphql';

export const origworld = {
  name: 'Bandi Adventure',
  logo: 'icones/bandiprofil.png',
  money: 0,
  score: 0,
  totalangels: 0,
  activeangels: 0,
  angelbonus: 2,
  lastupdate: 0,
   products: [
    {
      id: 1,
      name: 'Wumpa Fruit',
      logo: 'icones/product/wumpa.png',
      cout: 4,
      croissance: 1.07,
      revenu: 1,
      vitesse: 500,
      quantite: 1,
      timeleft: 0,
      managerUnlocked: false,
      paliers: [
        { name: 'Wumpa Boost', logo: 'icones/product/wumpa.png', seuil: 25, idcible: 1, ratio: 2, typeratio: RatioType.vitesse, unlocked: false },
        { name: 'Waaw Wumpa Fruit', logo: 'icones/product/wumpa.png', seuil: 50, idcible: 1, ratio: 2, typeratio: RatioType.vitesse, unlocked: false },
        { name: 'Wumpa Fruit primium', logo: 'icones/product/wumpa.png', seuil: 100, idcible: 1, ratio: 3, typeratio: RatioType.vitesse, unlocked: false }
      ],
    },
    {
      id: 2,
      name: 'Aku Aku Mask',
      logo: 'icones/product/akuaku.png',
      cout: 60,
      croissance: 1.15,
      revenu: 60,
      vitesse: 3000,
      quantite: 0,
      timeleft: 0,
      managerUnlocked: false,
      paliers: [
        { name: 'Mystic Shield', logo: 'icones/product/akuaku.png', seuil: 25, idcible: 2, ratio: 2, typeratio: RatioType.vitesse, unlocked: false },
        { name: 'Waaaw Aku Aku', logo: 'icones/product/akuaku.png', seuil: 75, idcible: 2, ratio: 3, typeratio: RatioType.gain, unlocked: false },
        { name: 'Aku Aku primium', logo: 'icones/product/akuaku.png', seuil: 150, idcible: 2, ratio: 4, typeratio: RatioType.vitesse, unlocked: false }
      ],
    },
    {
      id: 3,
      name: 'TNT Crate',
      logo: 'icones/product/tnt.png',
      cout: 500,
      croissance: 1.25,
      revenu: 500,
      vitesse: 7000,
      quantite: 0,
      timeleft: 0,
      managerUnlocked: false,
      paliers: [
        { name: 'Caisse TNT', logo: 'icones/product/tnt.png', seuil: 20, idcible: 3, ratio: 2, typeratio: RatioType.gain, unlocked: false },
        { name: 'Crash explosif', logo: 'icones/product/tnt.png', seuil: 50, idcible: 3, ratio: 3, typeratio: RatioType.vitesse, unlocked: false },
        { name: 'Missile', logo: 'icones/product/tnt.png', seuil: 100, idcible: 3, ratio: 4, typeratio: RatioType.gain, unlocked: false }
      ],
    },
    {
      id: 4,
      name: 'Nitro Power',
      logo: 'icones/product/poison.png',
      cout: 1000,
      croissance: 1.30,
      revenu: 1500,
      vitesse: 10000,
      quantite: 0,
      timeleft: 0,
      managerUnlocked: false,
      paliers: [
        { name: 'Nitro Power', logo: 'icones/product/poison.png', seuil: 30, idcible: 4, ratio: 2, typeratio: RatioType.gain, unlocked: false },
        { name: 'Waaaw Nitro Power', logo: 'icones/product/poison.png', seuil: 60, idcible: 4, ratio: 3, typeratio: RatioType.vitesse, unlocked: false },
        { name: 'Nitro Power primium', logo: 'icones/product/poison.png', seuil: 120, idcible: 4, ratio: 4, typeratio: RatioType.gain, unlocked: false }
      ],
    },
    {
      id: 5,
      name: 'Time Relic',
      logo: 'icones/product/relique.png',
      cout: 5000,
      croissance: 1.35,
      revenu: 7000,
      vitesse: 15000,
      quantite: 0,
      timeleft: 0,
      managerUnlocked: false,
      paliers: [
        { name: 'Time Relic', logo: 'icones/product/relique.png', seuil: 40, idcible: 5, ratio: 2, typeratio: RatioType.gain, unlocked: false },
        { name: 'Waaw Time Relic', logo: 'icones/product/relique.png', seuil: 80, idcible: 5, ratio: 3, typeratio: RatioType.vitesse, unlocked: false },
        { name: 'Time Relic primium', logo: 'icones/product/relique.png', seuil: 160, idcible: 5, ratio: 4, typeratio: RatioType.gain, unlocked: false }
      ],
    },


    {
      id: 6,
      name: 'Bombe bowling',
      logo: 'icones/product/bomb.png',
      cout: 10000,
      croissance: 1.40,
      revenu: 15000,
      vitesse: 20000,
      quantite: 0,
      timeleft: 0,
      managerUnlocked: false,
      paliers: [
        { name: 'Bombe bowling', logo: 'icones/product/bomb.png', seuil: 50, idcible: 6, ratio: 2, typeratio: RatioType.gain, unlocked: false },
        { name: 'Waaaw Bombe bowling', logo: 'icones/product/bomb.png', seuil: 100, idcible: 6, ratio: 3, typeratio: RatioType.vitesse, unlocked: false },
        { name: 'Bombe bowling primium', logo: 'icones/product/bomb.png', seuil: 200, idcible: 6, ratio: 4, typeratio: RatioType.gain, unlocked: false }
      ],
    }
  ],
  allunlocks: [
    { name: 'Power Gem', logo: 'icones/PowerGem.png', seuil: 25, idcible: 0, ratio: 2, typeratio: RatioType.vitesse, unlocked: false },
    { name: 'Nitrus Fungus', logo: 'icones/NitrusFungus.png', seuil: 50, idcible: 0, ratio: 2, typeratio: RatioType.gain, unlocked: false },
    { name: 'Crystals Wrath', logo: 'icones/Crystal.png', seuil: 100, idcible: 0, ratio: 3, typeratio: RatioType.gain, unlocked: false }
  ],
  upgrades: [
    { name: 'Wumpa Fruit', logo: 'icones/product/wumpa.png', seuil: 1000, idcible: 1, ratio: 3, typeratio: RatioType.gain, unlocked: false },
    { name: 'Aku Aku Mask', logo: 'icones/product/akuaku.png', seuil: 2000, idcible: 2, ratio: 3, typeratio: RatioType.vitesse, unlocked: false },
    { name: 'TNT Crate', logo: 'icones/product/tnt.png', seuil: 4000, idcible: 3, ratio: 4, typeratio: RatioType.gain, unlocked: false },
    { name: 'Nitro Power', logo: 'icones/product/poison.png', seuil: 5000, idcible: 4, ratio: 4, typeratio: RatioType.gain, unlocked: false }

  ],
  angelupgrades: [
    { name: 'Angel Sacrifice', logo: 'icones/upgrades-icones/angel.png', seuil: 10, idcible: 0, ratio: 3, typeratio: RatioType.gain, unlocked: false },
    { name: 'Guardian Angel', logo: 'icones/upgrades-icones/angel.png', seuil: 50, idcible: 0, ratio: 4, typeratio: RatioType.gain, unlocked: false },
    { name: 'Angel Rebellion', logo: 'icones/upgrades-icones/angel.png', seuil: 100, idcible: 0, ratio: 5, typeratio: RatioType.ange, unlocked: false }
  ],
  managers: [
    { name: 'Crash Bandicoot', logo: 'icones/managers/manager2.png', seuil: 10, idcible: 1, ratio: 0, typeratio: RatioType.gain, unlocked: false },
    { name: 'Dr. Neo Cortex', logo: 'icones/managers/manager5.png', seuil: 60, idcible: 2, ratio: 0, typeratio: RatioType.gain, unlocked: false },
    { name: 'Dr. Nitrus Brio', logo: 'icones/managers/manager1.png', seuil: 180, idcible: 3, ratio: 0, typeratio: RatioType.gain, unlocked: false },
    { name: 'Nefarious Tropy', logo: 'icones/managers/manager4.png', seuil: 2000, idcible: 4, ratio: 0, typeratio: RatioType.gain, unlocked: false },
    { name: 'Dr. N. Gin', logo: 'icones/managers/manager3.png', seuil: 10000, idcible: 5, ratio: 0, typeratio: RatioType.gain, unlocked: false },
    { name: 'Coco Bandicoot', logo: 'icones/managers/manager6.png', seuil: 80000, idcible: 6, ratio: 0, typeratio: RatioType.gain, unlocked: false }
  ]
};
