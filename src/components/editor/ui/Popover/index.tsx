import MuiPopover, {
  type PopoverProps as MuiPopoverProps,
} from "@mui/material/Popover";
import { Button as MuiButton, SvgIcon, styled } from "@mui/material";

export interface PopoverItemProps {
  title: string;
  active?: boolean;
  icon: React.ElementType;
  onClick?: () => void;
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

const StyledPopover = styled(MuiPopover)({
  "& .MuiPopover-paper": {
    display: "flex",
    flexDirection: "column",
    gap: "1px",
    marginTop: "0.5rem",
    borderRadius: "6px",
    backgroundColor: "#EAEAEA",
    boxShadow: "none",
    // boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.05)",
    // border: "1px solid #8787870d",
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
