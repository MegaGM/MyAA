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
    titleMAL: 'Fairy Tail Final Series',
    titleNyaa: 'Fairy Tail Final Season',
    subTeam: 'HorribleSubs',
    seasonOffset: 278,
  },
  {
    titleMAL: 'Fairy Gone 2nd Season',
    titleNyaa: 'Fairy Gone',
    subTeam: 'HorribleSubs',
    seasonOffset: 12,
  },
  {
    titleMAL: 'Mairimashita Iruma-kun',
    titleNyaa: 'Mairimashita! Iruma-kun',
  },
  {
    titleMAL: 'Mugen no Juunin Immortal',
    titleNyaa: 'Mugen no Juunin - Immortal',
  },
  {
    titleMAL: 'Sword Art Online Alicization - War of Underworld',
    titleNyaa: 'Sword Art Online - Alicization - War of Underworld',
  },
  {
    titleMAL: 'Shinchou Yuusha Kono Yuusha ga Ore Tueee Kuse ni Shinchou Sugiru',
    titleNyaa: 'Shinchou Yuusha',
  },
  {
    titleMAL: 'Watashi, Nouryoku wa Heikinchi de tte Itta yo ne',
    titleNyaa: 'Watashi, Nouryoku wa Heikinchi de tte Itta yo ne!',
  },
  {
    titleMAL: 'Boku no Hero Academia 4th Season',
    titleNyaa: 'Boku no Hero Academia',
    seasonOffset: 63,
  },
]

module.exports = { diffMap: MALtoNyaaTitleDiffMap }