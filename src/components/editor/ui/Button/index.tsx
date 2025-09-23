import { IconButton, styled, SvgIcon, Tooltip } from "@mui/material";

export interface ToolbarButtonProps {
  title: string;
  active: boolean;
  icon: React.ElementType;
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
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

const StyledIconButton = styled(IconButton)(({ theme }) => {
  return {
    width: 36,
    height: 36,
    padding: 6,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent !important",

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
