const { MONGO_BBQ_URL, MONGO_BBQ_USERNAME, MONGO_BBQ_PASSWORD, MONGO_BBQ_NAME } = process.env
module.exports = {
  MONGODB_URL: `mongodb://${MONGO_BBQ_USERNAME}:${MONGO_BBQ_PASSWORD}@${MONGO_BBQ_URL}/${MONGO_BBQ_NAME}?authSource=${MONGO_BBQ_NAME}`,
  NAME: MONGO_BBQ_NAME,
  SCHEMA: {
    GAME: 'game',
    USER: 'user',
    QUEST: 'quest',
    CATEGORY: 'category',
    QUESTION: 'question',
    PLAYER: 'player',
    ANS: 'ans',
    ROLE: 'role',
    MIGRATION: 'migration',
    SCHEDULE_GAME_TICKET: 'schedule_game_ticket',
  },
}
