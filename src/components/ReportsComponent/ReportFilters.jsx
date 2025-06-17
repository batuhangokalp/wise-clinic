import { Form, FormGroup, Label, Input, Button, Row, Col } from "reactstrap";
import "../../assets/scss/reports/report-filters.scss";

export default function ReportFilters({
  startDate,
  endDate,
  channel,
  onChange,
  onApply,
}) {
  return (
    <Form className="report-filters">
      <Row form>
        <Col md={3}>
          <FormGroup>
            <Label for="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => onChange("startDate", e.target.value)}
            />
          </FormGroup>
        </Col>
        <Col md={3}>
          <FormGroup>
            <Label for="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => onChange("endDate", e.target.value)}
            />
          </FormGroup>
        </Col>
        <Col md={3}>
          <FormGroup>
            <Label for="channel">Channel</Label>
            <Input
              id="channel"
              type="select"
              value={channel}
              onChange={(e) => onChange("channel", e.target.value)}
            >
              <option value="all">All Channels</option>
              <option value="3">WhatsApp</option>
              <option value="2">Instagram</option>
              <option value="1">Facebook</option>
            </Input>
          </FormGroup>
        </Col>
        <Col md={3}>
          <FormGroup className="d-flex align-items-center h-100">
            <Button color="primary" onClick={onApply}>
              Apply
            </Button>
          </FormGroup>
        </Col>
      </Row>
    </Form>
  );
}
