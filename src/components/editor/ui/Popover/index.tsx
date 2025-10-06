import { TEXT_COLORS } from "../../plugins/ToolbarPlugin/config";

import MuiPopover, {
  type PopoverProps as MuiPopoverProps,
} from "@mui/material/Popover";
import { Button as MuiButton, SvgIcon, styled } from "@mui/material";
import { Check } from "@mui/icons-material";

export interface PopoverItemProps {
  title: string;
  active?: boolean;
  icon: React.ElementType;
  onClick?: () => void;
}

export type TextColor = (typeof TEXT_COLORS)[number];
export interface ColorPickerPopoverProps extends MuiPopoverProps {
  value: TextColor;
  onColorChange?: (color: TextColor) => void;
}

export function Popover(props: MuiPopoverProps) {
  return <StyledPopover {...props}>{props.children}</StyledPopover>;
}

export function PopoverItem({
  title,
  icon,
  onClick,
  active = false,
}: PopoverItemProps) {
  return (
    <StyledButton color={active ? "primary" : "inherit"} onClick={onClick}>
      <span style={{ marginRight: "1.5rem" }}>{title}</span>
      <SvgIcon component={icon} inheritViewBox />
    </StyledButton>
  );
}

export function ColorPickerPopover({
  value,
  onColorChange,
  ...props
}: ColorPickerPopoverProps) {
  return (
    <StyledPopover {...props}>
      <div
        style={{
          display: "flex",
          gap: "0.4rem",
          padding: "2px",
        }}
      >
        {TEXT_COLORS.map((color, index) => (
          <CircleCheckbox
            key={index}
            fill={color}
            checked={value === color}
            onClick={() => onColorChange?.(color)}
          />
        ))}
      </div>
    </StyledPopover>
  );
}

const StyledPopover = styled(MuiPopover)({
  "& .MuiPopover-paper": {
    display: "flex",
    flexDirection: "column",
    gap: "1px",
    marginTop: "0.5rem",
    borderRadius: "6px",
    backgroundColor: "#EAEAEA",
    boxShadow: "none",
  },
});

const StyledButton = styled(MuiButton)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  backgroundColor: "#f5f5f5",
  color: "#878787",
  borderRadius: 0,
  padding: "0 0 0 10px",
  minWidth: 130,
  fontSize: 16.5,
  fontWeight: 500,
  textTransform: "capitalize",
  transition: "color 0.15s ease-in-out",

  "&.MuiButton-colorPrimary": {
    color: theme.palette.primary.main,
  },

  "& .MuiSvgIcon-root": {
    fontSize: "40px",
    transition: "color 0.15s ease-in-out",
  },

  "&:hover": {
    color: "black",

    "& .MuiSvgIcon-root": {
      color: "black",
    },
  },
}));

const CircleCheckbox = ({
  fill,
  checked,
  onClick,
}: {
  fill: string;
  checked?: boolean;
  onClick?: () => void;
}) => (
  <div
    style={{
      padding: "5px",
      cursor: "pointer",
    }}
    onClick={onClick}
  >
    <div
      style={{
        width: 22,
        height: 22,
        backgroundColor: fill,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
      }}
    >
      {checked && <Check sx={{ color: "white", fontSize: 20 }} />}
    </div>
  </div>
);
