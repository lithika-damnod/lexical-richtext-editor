import { Button, IconButton, styled, SvgIcon, Tooltip } from "@mui/material";
import { ChevronIcon } from "../../icons";

export interface ToolbarButtonProps {
  title: string;
  active: boolean;
  icon: React.ElementType;
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export interface ToolbarBlockTypeButtonProps {
  icon: React.ElementType;
  opened: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function ToolbarButton({
  title,
  active,
  icon,
  onClick,
  disabled = false,
}: ToolbarButtonProps) {
  return (
    <Tooltip title={title}>
      <StyledIconButton
        className={active ? "active" : ""}
        color={active ? "primary" : "default"}
        onClick={onClick}
        disabled={disabled}
      >
        <SvgIcon component={icon} inheritViewBox />
      </StyledIconButton>
    </Tooltip>
  );
}

export function ToolbarBlockTypeButton({
  icon,
  opened = false,
  onClick,
}: ToolbarBlockTypeButtonProps) {
  return (
    <StyledButton disableRipple onClick={onClick} opened={opened}>
      <SvgIcon component={icon} inheritViewBox />
      <SvgIcon component={ChevronIcon} inheritViewBox />
    </StyledButton>
  );
}

const baseButtonStyles = {
  width: 36,
  height: 36,
  padding: 6,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "transparent !important",
};

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "opened",
})<{ opened: boolean }>(({ opened }) => ({
  ...baseButtonStyles,

  "& .MuiSvgIcon-root": {
    fontSize: "40px",
    color: opened ? "black" : "#808080",
    transition: "color 0.15s ease-in-out",
  },

  "& .MuiSvgIcon-root:nth-child(2)": {
    color: opened ? "#808080" : "#ABABAB",
    transform: opened ? "rotate(180deg)" : "rotate(0deg)",
  },

  "&:hover .MuiSvgIcon-root:nth-child(1)": {
    color: "black",
  },

  "&:hover .MuiSvgIcon-root:nth-child(2)": {
    color: "#808080",
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => {
  return {
    ...baseButtonStyles,

    "& .MuiSvgIcon-root": {
      fontSize: "40px",
      color: "#808080",
      transition: "color 0.15s ease-in-out",

      "&:hover": {
        color: "black",
      },
    },

    "&.active .MuiSvgIcon-root": {
      color: theme.palette.primary.main,
    },

    "&.Mui-disabled .MuiSvgIcon-root": {
      color: "#D9D9D9",
    },
  };
});
