import { AuthToken, Player, Member } from "./storage";
import { getWeek } from "./datetime";

export const constructPlayer = (member: Member, authToken: AuthToken): Player => {
    const { FirstName, LastName, EmailAddress } = member;
    const timeOfGame = new Date(authToken.DateAndTimeOfGame._seconds * 1000);
    const gameWeek = getWeek(timeOfGame);
    return {
        CourtNumber: 0,
        Position: null,
        EmailAddress,
        FirstName,
        LastName,
        DateAndTimeOfGame: authToken.DateAndTimeOfGame,
        GameWeek: gameWeek
    };
};