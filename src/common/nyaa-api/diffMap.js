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
  // },
  {
    titleMAL: 'Fairy Tail Final Series',
    titleNyaa: 'Fairy Tail Final Season',
    subTeam: 'HorribleSubs',
  },
  {
    titleMAL: 'Nande Koko ni Sensei ga?',
    titleNyaa: 'Nande Koko ni Sensei ga',
    subTeam: 'PuyaSubs!',
  },
  {
    titleMAL: 'Carole & Tuesday',
    titleNyaa: 'Carole & Tuesday',
    subTeam: 'PAS',
  },
  {
    titleMAL: 'Dumbbell Nan Kilo Moteru?',
    titleNyaa: 'Dumbbell Nan Kilo Moteru',
  },
  {
    titleMAL: 'Sounan Desu ka?',
    titleNyaa: 'Sounan desu ka',
  },
  {
    titleMAL: 'Senki Zesshou Symphogear XV',
    titleNyaa: 'Symphogear XV',
  },
  {
    titleMAL: 'Uchi no Ko no Tame naraba, Ore wa Moshikashitara Maou mo Taoseru kamo Shirenai.',
    titleNyaa: 'UchiMusume',
  },
  {
    titleMAL: 'Maou-sama, Retry',
    titleNyaa: 'Maou-sama, Retry!',
  },
  {
    titleMAL: 'Lord El-Melloi II Sei no Jikenbo Rail Zeppelin Grace Note',
    titleNyaa: 'Lord El-Melloi II Case Files',
  },
  {
    titleMAL: 'Kawaikereba Hentai demo Suki ni Natte Kuremasu ka?',
    titleNyaa: 'HenSuki',
  },
  {
    titleMAL: 'Nakanohito Genome [Jikkyouchuu]',
    titleNyaa: 'Nakanohito Genome [Jikkyouchuu]',
  },
  {
    titleMAL: 'Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka II',
    titleNyaa: 'DanMachi S2',
  },
]

module.exports = { diffMap: MALtoNyaaTitleDiffMap }