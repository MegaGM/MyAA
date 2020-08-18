'use strict'
/**
 * NOTE: in Nyaa.Episode.parseTitle()
 * we collect uniqueSubTeams from this file
 * so be sure HorribleSubs is included at least in one of the entries
 */
/**
 * NOTE: exclamation marks (!) should be ommited in titleMAL
 */
const MALtoNyaaTitleDiffMap = [
  // an example
  // {
  //   titleMAL: 'Mob Psycho 100 II',
  //   titleNyaa: 'Mob Psycho 100 S2',
  //   subTeam: 'HorribleSubs',
  //   quality: '1080',
  //   seasonOffset: 12,
  // },
  {
    titleMAL: 'Fruits Basket 2nd Season',
    titleNyaa: 'Fruits Basket S2 (2019)',
  },
  {
    titleMAL: 'Yahari Ore no Seishun Love Comedy wa Machigatteiru. Kan',
    titleNyaa: 'Yahari Ore no Seishun Love Come wa Machigatteiru Kan',
  },
  {
    titleMAL: 'Uzaki-chan wa Asobitai',
    titleNyaa: 'Uzaki-chan wa Asobitai!',
  },
  {
    titleMAL: 'Koi to Producer EVOL×LOVE',
    titleNyaa: 'Koi to Producer - Evol x Love',
  },
  {
    titleMAL: 'Maou Gakuin no Futekigousha Shijou Saikyou no Maou no Shiso, Tensei shite Shison-tachi no Gakkou e',
    titleNyaa: 'Maou Gakuin no Futekigousha',
  },
  {
    titleMAL: 'No Guns Life 2nd Season',
    titleNyaa: 'No Guns Life',
    seasonOffset: 12,
  },
  {
    titleMAL: 'ReZero kara Hajimeru Isekai Seikatsu 2nd Season',
    titleNyaa: 'Re Zero kara Hajimeru Isekai Seikatsu',
    seasonOffset: 25,
  },
  {
    titleMAL: 'Sword Art Online Alicization - War of Underworld 2nd Season',
    titleNyaa: 'Sword Art Online - Alicization - War of Underworld',
    seasonOffset: 12,
  },
  {
    titleMAL: 'Ninja Collection',
    titleNyaa: 'Ninja Collection',
  },
  {
    titleMAL: 'Fugou Keiji BalanceUnlimited',
    titleNyaa: 'Fugou Keiji Balance - UNLIMITED',
  },
  
]

module.exports = { diffMap: MALtoNyaaTitleDiffMap }