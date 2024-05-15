import { render, screen, waitFor } from "@testing-library/react-native";
import { HttpResponse, http } from "msw";
import { TestWrapper } from "../../../../shared/tests/mocks/TestWrapper";
import {
  createHttpServerMock,
  getMockServerUrl,
} from "../../../../shared/tests/mocks/http-server-mock";
import { useProfileSwitcherStore } from "../../../profile-switcher/state/useProfileSwitcherStore";
import { sleepSessionMock } from "../../../sessions/tests/mocks/session-mock";
import { SleepSession } from "../../../sessions/types/sleep-session.type";
import { createPerson } from "../../../user/tests/mocks/user-mock";
import Home from "../Home";
import { getAmountOfSleep } from "../../../sessions/utils/metrics/get-amount-of-sleep";

jest.mock("../../../sessions/layout/components/Metrics/SleepFitness", () => {
  const { View, Text } = jest.requireActual("react-native");
  return {
    SleepFitness: ({ score }: { score: SleepSession["score"] }) => (
      <View>
        <Text>{score}%</Text>
      </View>
    ),
  };
});

const user1 = createPerson();
const user2 = createPerson();

const handlers = [
  http.get(getMockServerUrl("/users.json"), () => {
    return HttpResponse.json({
      users: [user1, user2],
    });
  }),
  http.get(getMockServerUrl(`/${user1.id}.json`), () => {
    return HttpResponse.json(sleepSessionMock);
  }),
];

const httpServer = createHttpServerMock(handlers);

const todayMock = new Date(sleepSessionMock.intervals[0].ts);

jest.useFakeTimers();
jest.setSystemTime(todayMock.getTime());

beforeAll(() => {
  httpServer.listen();
  useProfileSwitcherStore.getState().signInUser(user1);
});
afterEach(() => httpServer.resetHandlers());
afterAll(() => httpServer.close());

describe("Home", () => {
  it("should render properly", async () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText(`Hello ${user1?.name},`)).toBeOnTheScreen();
    });
    expect(screen.getByText("Sleep report")).toBeOnTheScreen();
    expect(
      screen.getByText(
        todayMock.toLocaleDateString("en-us", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      ),
    ).toBeOnTheScreen();
    expect(screen.getByText("44%")).toBeOnTheScreen();
    expect(screen.getByText("Time Slept")).toBeOnTheScreen();
    expect(screen.getByText("4h 55m")).toBeOnTheScreen();
  });
});
