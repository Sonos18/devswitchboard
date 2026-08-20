# Verification Report

A Verification Report maps fresh checks to acceptance criteria. Each check names the criterion, command or inspection method, result, and evidence. Overall status is `pass` only when every required check passes; otherwise it is `fail`.

Final verification MUST run after the last content change. It cannot be reused through Semantic Gate Deduplication. A passing report supports developer review but never performs final acceptance on the developer's behalf.

Schema: [`verification-report.schema.json`](../../schemas/verification-report.schema.json).
