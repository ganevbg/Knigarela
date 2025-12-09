namespace Knigarela.Core.Helpers
{
    using System.Text.Json;
    using System.Text.Json.Serialization;

    public class SpeedyDateTimeConverter : JsonConverter<DateTime?>
    {
        public override DateTime? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.Null)
                return null;

            var raw = reader.GetString();
            if (string.IsNullOrWhiteSpace(raw))
                return null;

            // Speedy gives: 2025-12-09T19:00:00+0200
            // Convert to:   2025-12-09T19:00:00+02:00
            if (raw.Length > 5 && raw[^5] == '+' && raw[^2] != ':')
            {
                raw = raw.Insert(raw.Length - 2, ":");
            }

            return DateTime.Parse(raw, null, System.Globalization.DateTimeStyles.RoundtripKind);
        }

        public override void Write(Utf8JsonWriter writer, DateTime? value, JsonSerializerOptions options)
        {
            if (value == null)
                writer.WriteNullValue();
            else
                writer.WriteStringValue(value.Value.ToString("yyyy-MM-ddTHH:mm:sszzz"));
        }
    }

}
