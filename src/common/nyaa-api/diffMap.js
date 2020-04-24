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
    titleMAL: 'Boku no Hero Academia 4th Season',
    titleNyaa: 'Boku no Hero Academia',
    seasonOffset: 63,
  },
  {
    titleMAL: 'Ishuzoku Reviewers',
    titleNyaa: 'Ishuzoku Reviewers (Interspecies Reviewers)',
    subTeam: 'Judas',
    quality: 'UNCENSORED 1080p',
  },
  {
    titleMAL: 'Shachou, Battle no Jikan Desu',
    titleNyaa: 'Shachou, Battle no Jikan desu!',
  },
  {
    titleMAL: 'Shironeko Project Zero Chronicle',
    titleNyaa: 'Shironeko Project - Zero Chronicle',
  },
  {
    titleMAL: 'Fruits Basket 2nd Season',
    titleNyaa: 'Fruits Basket S2 (2019)',
  },
  {
    titleMAL: 'Kingdom 3rd Season',
    titleNyaa: 'Kingdom S3',
  },
  {
    titleMAL: 'Kami no Tou',
    titleNyaa: 'Tower of God',
  },
  {
    titleMAL: 'Hachi-nan tte, Sore wa Nai deshou',
    titleNyaa: 'Hachi-nan tte, Sore wa Nai deshou!',
  },
  {
    titleMAL: 'Kaguya-sama wa Kokurasetai? Tensai-tachi no Renai Zunousen',
    titleNyaa: 'Kaguya-sama wa Kokurasetai S2',
  },
  {
    titleMAL: 'Fugou Keiji BalanceUnlimited',
    titleNyaa: 'Fugou Keiji Balance - UNLIMITED',
  },
  {
    titleMAL: 'Princess Connect ReDive',
    titleNyaa: 'Princess Connect! Re Dive',
  },
]

module.exports = { diffMap: MALtoNyaaTitleDiffMap }