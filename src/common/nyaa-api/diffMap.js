'use strict'
/**
 * NOTE: in Nyaa.Episode.parseTitle()
 * we collect uniqueSubTeams from this file
 * so be sure HorribleSubs is included at least in one of the entries
 */
const MALtoNyaaTitleDiffMap = [
  // an example
  // {
  //   titleMAL: 'Mob Psycho 100 II',
  //   titleNyaa: 'Mob Psycho 100 S2',
  //   subTeam: 'HorribleSubs',
  //   quality: '1080',
  // },
  {
    titleMAL: 'Fairy Tail Final Series',
    titleNyaa: 'Fairy Tail Final Season',
    subTeam: 'HorribleSubs',
  },
  {
    titleMAL: 'Uchuu Senkan Yamato 2202 Ai no Senshi-tachi',
    titleNyaa: 'Uchuu Senkan Yamato 2202',
    subTeam: 'project-gxs',
  },
  {
    titleMAL: 'One Punch Man 2nd Season',
    titleNyaa: 'One Punch Man S2',
  },
  {
    titleMAL: 'Bungou Stray Dogs 3rd Season',
    titleNyaa: 'Bungou Stray Dogs',
  },
  {
    titleMAL: 'Chou Kadou Girl ⅙ Amazing Stranger',
    titleNyaa: 'Amazing Stranger',
  },
]

module.exports = { diffMap: MALtoNyaaTitleDiffMap }