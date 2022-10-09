//
//  CanvasView.swift
//  PocketCards
//
//  Created by macmini on 2022/10/06.
//

import PencilKit
import SwiftUI

struct CanvasView: UIViewRepresentable {
    @Binding var canvasView: PKCanvasView
    @State var toolPicker = PKToolPicker()

    func makeUIView(context _: Context) -> PKCanvasView {
        canvasView.tool = PKInkingTool(.pen, color: .black, width: 15)
        canvasView.layer.borderColor = UIColor.red.cgColor
        canvasView.drawing = PKDrawing()

        if UIApplication.shared.connectedScenes.first != nil {
            toolPicker.addObserver(canvasView)
            toolPicker.setVisible(true, forFirstResponder: canvasView)
            canvasView.becomeFirstResponder()
        }

        return canvasView
    }

    func updateUIView(_: PKCanvasView, context _: Context) {}
}
