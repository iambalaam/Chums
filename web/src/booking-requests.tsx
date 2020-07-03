import * as React from 'react';
import './booking-requests.css';
import { getToken, getCourts } from './api';
import { getWeek } from '../../functions/src/util/datetime';
import { Loading } from './components/loading';
import { GameWeekTable } from './game-week-table';
import { UserFacingError, isError } from './util';
import { CourtWithId } from '../../functions/src/util/storage';

const WEEKS_TO_SHOW = 2;

export interface BookingRequestsProps {
    handleError: (err: any) => void;
}
export interface BookingRequestsState {
    isLoading: boolean;
    courtsByWeek?: { [week: number]: CourtWithId[]; };
}

export class BookingRequests extends React.Component<BookingRequestsProps, BookingRequestsState> {
    constructor(props: BookingRequestsProps) {
        super(props);
        this.state = { isLoading: true };
    }

    async componentDidMount() {
        const token = getToken();
        if (token) {
            try {
                const courtTimes = await getCourts(token);
                if (isError(courtTimes)) throw new UserFacingError(
                    `Couldn't get court times`,
                    courtTimes.message,
                    courtTimes.stack || '',
                );

                const courtsByWeek: { [week: number]: CourtWithId[]; } = {};
                courtTimes.forEach((court) => {
                    const date = new Date(court.DateAndTimeOfGame._seconds * 1000);
                    const week = getWeek(date);
                    if (!courtsByWeek[week]) {
                        courtsByWeek[week] = [];
                    }
                    courtsByWeek[week].push(court);
                });
                this.setState({
                    isLoading: false,
                    courtsByWeek
                });
            } catch (error) {
                this.props.handleError(error);
            }
        }
    }

    render() {
        const { isLoading, courtsByWeek } = this.state;
        return (
            <main>
                {isLoading
                    ? <Loading />
                    : <>
                        {Object.entries(courtsByWeek!)
                            .sort(([week1], [week2]) => parseInt(week2) - parseInt(week1))
                            .slice(0, WEEKS_TO_SHOW + 1)
                            .map(([week, courts]) => (
                                <>
                                    <h1 className="game-week">Game Week <span className="number">{week}</span></h1>
                                    <GameWeekTable courts={courts} />
                                </>
                            ))}
                    </>}
            </main>
        );
    }

}