import { Box, HStack, Text } from "@gluestack-ui/themed";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import DateDisplay from "./DateDisplay";
import NextDayButton from "./NextDayButton";
import Popover from "./PopoverWrapper";
import PreviousDayButton from "./PreviousDayButton";
import { useDatePicker } from "./hooks/useDatePicker";
import { DatePickerProps } from "./types/DatePicker.type";

export function DatePicker({
  currentDate,
  onDateChange,
  latestSessionDate,
}: DatePickerProps) {
  const [pickDateButtonWidth, setPickDateButtonWidth] = useState<number>(100);
  const {
    value,
    datePickerVisible,
    goToPreviousDay,
    closeCustomDatePicker,
    openCustomDatePicker,
    onPickCustomDate,
    goToNextDay,
    onPressLatestSession,
    onPressToday,
  } = useDatePicker({
    currentDate,
    onDateChange,
    latestSessionDate,
  });

  return (
    <HStack w={"$full"} p="$0.5" alignItems="center">
      <PreviousDayButton onPress={goToPreviousDay} />
      <Box flex={5} alignItems="center">
        <Popover.Wrapper
          isOpen={datePickerVisible}
          onClose={closeCustomDatePicker}
          onOpen={openCustomDatePicker}
          popoverWidth={pickDateButtonWidth}
          trigger={triggerProps => {
            return (
              <DateDisplay
                {...triggerProps}
                isChecked={datePickerVisible}
                date={value}
                notifyCurrentWidth={width => {
                  setPickDateButtonWidth(width);
                }}
              />
            );
          }}
        >
          <Popover.Body>
            <HStack mt="$4" alignItems="center" justifyContent="center">
              <Text size="md">Select date:</Text>
              <DateTimePicker
                testID="custom-date-picker"
                value={value}
                mode={"date"}
                onChange={onPickCustomDate}
              />
            </HStack>
          </Popover.Body>
          <Popover.Footer
            hideLatestSession={
              !latestSessionDate ||
              value.toDateString() === latestSessionDate.toDateString()
            }
            hideToday={value.toDateString() === new Date().toDateString()}
            onPressLatestSession={onPressLatestSession}
            onPressToday={onPressToday}
          />
        </Popover.Wrapper>
      </Box>
      <NextDayButton onPress={goToNextDay} />
    </HStack>
  );
}
