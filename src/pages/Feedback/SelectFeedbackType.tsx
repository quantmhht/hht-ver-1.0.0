    import { Divider } from "@components";
    import AppCheckbox from "@components/customized/Checkbox";
    import React from "react";
    import styled from "styled-components";
    import tw from "twin.macro";
    import { Box, Checkbox } from "zmp-ui";
    import { CheckboxGroupProps, CheckboxValueType } from "zmp-ui/checkbox";

    const Label = styled.div`
      ${tw`font-medium py-2`}
    `;
    const FeedbackGroup = styled(Checkbox.Group)`
      ${tw`flex flex-col gap-4 mt-2 text-[#767A7F]`}
    `;
    const FormItem = styled.div``;

    export interface SelectFeedbackTypeProps extends Omit<CheckboxGroupProps, "onChange" | "value"> {
      onChange?: (id: string) => void;
      value?: CheckboxValueType;
    }

    const feedbackTypes = [
      { id: 1, title: "Tin báo về ANTT" },
      { id: 2, title: "Tin báo về văn hóa xã hội" },
      { id: 3, title: "Tin báo về địa chính, xây dựng, kinh doanh, đô thị" },
      { id: 4, title: "Tin báo khác" },
    ];

    const SelectFeedbackType: React.FC<SelectFeedbackTypeProps> = ({
      onChange,
      value,
    }) => {
      const onChangeType = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.value);
      };

      return (
        <FormItem>
          <Label>Mục phản ánh*</Label>
          <Box my={4}><Divider /></Box>
          <FeedbackGroup value={value ? [value] : []}>
            {feedbackTypes.map((type) => (
              <AppCheckbox
                onChange={onChangeType}
                value={type.id.toString()}
                key={`fb-type-${type.id}`}
                label={type.title}
                checked={value === type.id.toString()}
              />
            ))}
          </FeedbackGroup>
        </FormItem>
      );
    };

    export default SelectFeedbackType;
    