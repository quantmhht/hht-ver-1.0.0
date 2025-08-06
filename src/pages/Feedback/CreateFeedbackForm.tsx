    import { Button, Divider, ImageUpload, TextArea, Input } from "@components";
    import { RATE_LIMIT_CODE } from "@constants";
    import { MAX_FEEDBACK_IMAGES } from "@constants/common";
    import { AppError } from "@dts";
    import { useStore } from "@store";
    import React, { useState } from "react";
    import styled from "styled-components";
    import tw from "twin.macro";
    import { Box, Icon } from "zmp-ui";
    import { ImageType } from "zmp-ui/image-viewer";
    import { useForm, Controller } from "react-hook-form";
    import SelectFeedbackType from "./SelectFeedbackType";

    const Conainer = styled(Box)`
      ${tw`bg-white`}
    `;
    const SendButton = styled(Button)`
      ${tw`w-full mt-6`}
    `;

    export interface CreateFeedbackFormProps {
      successCallback?: (status?: boolean) => void;
    }

    const CreateFeedbackForm: React.FC<CreateFeedbackFormProps> = ({
      successCallback,
    }) => {
      const [loading, createFeedback] = useStore((state) => [
        state.creatingFeedback,
        state.createFeedback,
      ]);
      const [imageUrls, setImageUrls] = useState<(ImageType & { name: string })[]>([]);
      const {
        register,
        handleSubmit,
        control,
        formState: { errors },
      } = useForm({ mode: "onChange" });

      const onSubmit = async (data: any) => {
        const { title, content, fullName, address, phoneNumber, nationalId, feedbackType } = data;
        try {
          await postFeedback({
            token: "",
            title,
            content,
            fullName,
            address,
            phoneNumber,
            nationalId,
            feedBackTypeId: Number(feedbackType),
            imageUrls: imageUrls.map((img) => img.name),
          });
        } catch (err) {
          setError({
            message: "Có lỗi xảy ra, vui lòng thử lại sau!",
          });
        }
      };

      const handleImagesChange = (imgs: any) => {
        setImageUrls(imgs);
      };

      const getFieldName = (field: string) => {
        switch (field) {
          case "fullName": return "Họ và Tên";
          case "address": return "Địa chỉ";
          case "phoneNumber": return "Số điện thoại";
          case "nationalId": return "Số CCCD";
          case "content": return "Nội dụng phản ánh";
          case "feedbackType": return "Loại tin báo";
          default: return "";
        }
      };

      const getErrorMessage = (field: string) => {
        if ((errors as any)[field]) {
          const name = getFieldName(field);
          if ((errors as any)[field]?.type === "required")
            return `${name} không được để trống`;
          return `${name} không hợp lệ`;
        }
        return "";
      };

      const { id: organizationId } = useStore((state) => state.organization) || {
        id: "",
      };
      const setError = useStore((state) => state.setError);

      const postFeedback = async (params: any) => {
        try {
          if (!organizationId) return;
          const status = await createFeedback(params, organizationId);
          successCallback?.(status);
        } catch (err) {
          if (err) {
            const { message, code } = err as AppError;
            if (code === RATE_LIMIT_CODE.code) {
              setError({ code, message });
            } else {
              setError({ message: "Có lỗi xảy ra, vui lòng thử lại sau!" });
            }
          }
        }
      };

      return (
        <Conainer p={4} m={0}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box>
              <Input
                label="Họ và Tên*"
                errorText={getErrorMessage("fullName")}
                {...register("fullName", { required: true })}
                status={errors?.fullName ? "error" : "default"}
              />
            </Box>
            <Box mt={4}>
              <Input
                label="Địa chỉ*"
                errorText={getErrorMessage("address")}
                {...register("address", { required: true })}
                status={errors?.address ? "error" : "default"}
              />
            </Box>
            <Box mt={4}>
              <Input
                label="Số điện thoại*"
                errorText={getErrorMessage("phoneNumber")}
                {...register("phoneNumber", { required: true })}
                status={errors?.phoneNumber ? "error" : "default"}
              />
            </Box>
            <Box mt={4}>
              <Input
                label="Số CCCD*"
                errorText={getErrorMessage("nationalId")}
                {...register("nationalId", { required: true })}
                status={errors?.nationalId ? "error" : "default"}
              />
            </Box>
            <Box my={4}><Divider /></Box>
            <Box>
              <TextArea
                placeholder="Nhập nội dung"
                label="Nội dụng phản ánh*"
                errorText={getErrorMessage("content")}
                {...register("content", { required: true })}
                status={errors?.content ? "error" : "default"}
              />
            </Box>
            <Box my={4}><Divider /></Box>
            <Controller
              name="feedbackType"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <SelectFeedbackType value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.feedbackType && (
              <p className="text-red-500 text-sm mt-1">Vui lòng chọn loại tin báo</p>
            )}
            <Box my={4}><Divider /></Box>
            <Box>
              <ImageUpload
                label="Ảnh đính kèm"
                maxItemSize={1024 * 1024}
                maxSelect={MAX_FEEDBACK_IMAGES}
                onImagesChange={handleImagesChange}
              />
            </Box>
            <SendButton
              loading={loading}
              htmlType="submit"
              suffixIcon={<Icon icon="zi-chevron-right" />}
            >
              Gửi phản ánh
            </SendButton>
          </form>
        </Conainer>
      );
    };

    export default CreateFeedbackForm;
    