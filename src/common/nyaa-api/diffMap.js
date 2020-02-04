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
    seasonOffset: 277,
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
    titleMAL: 'Boku no Hero Academia 4th Season',
    titleNyaa: 'Boku no Hero Academia',
    seasonOffset: 63,
  },
  {
    titleMAL: 'Itai no wa Iya nano de Bougyoryoku ni Kyokufuri Shitai to Omoimasu.',
    titleNyaa: 'Itai no wa Iya nano de Bougyoryoku ni Kyokufuri Shitai to Omoimasu',
  },
  {
    titleMAL: 'Isekai Quartet 2',
    titleNyaa: 'Isekai Quartet S2',
  },
  {
    titleMAL: 'Magia Record Mahou Shoujo Madoka☆Magica Gaiden',
    titleNyaa: 'Magia Record',
  },
  {
    titleMAL: 'Rikei ga Koi ni Ochita no de Shoumei shitemita.',
    titleNyaa: 'Rikei ga Koi ni Ochita no de Shoumei shitemita',
  },
]

module.exports = { diffMap: MALtoNyaaTitleDiffMap }