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
    titleMAL: 'ReZero kara Hajimeru Isekai Seikatsu 2nd Season',
    titleNyaa: 'Re Zero kara Hajimeru Isekai Seikatsu',
    seasonOffset: 25,
  },
  {
    titleMAL: 'Ninja Collection',
    titleNyaa: 'Ninja Collection',
  },
  
  {
    titleMAL: 'Kami-tachi ni Hirowareta Otoko',
    titleNyaa: 'Kami-tachi ni Hirowareta Otoko',
    subTeam: 'Erai-raws',
    quality: '1080',
  },
  {
    titleMAL: 'Kimi to Boku no Saigo no Senjou, Aruiwa Sekai ga Hajimaru Seisen',
    titleNyaa: 'Kimi to Boku no Saigo no Senjou Arui wa Sekai ga Hajimaru Seisen',
    subTeam: 'Erai-raws',
    quality: '1080',
  },
  {
    titleMAL: 'Mahouka Koukou no Rettousei Raihousha-hen',
    titleNyaa: 'Mahouka Koukou no Rettousei - Raihousha Hen',
    subTeam: 'Erai-raws',
    quality: '1080',
  },
  {
    titleMAL: 'Black Clover',
    titleNyaa: 'Black Clover (TV)',
    subTeam: 'Erai-raws',
    quality: '1080',
  },
]

module.exports = { diffMap: MALtoNyaaTitleDiffMap }