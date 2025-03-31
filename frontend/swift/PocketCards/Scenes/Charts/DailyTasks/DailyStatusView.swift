//
//  DailyStatusView.swift
//  PocketCards
//
//  Created by macmini on 2022/03/23.
//
//

import SwiftUI

struct DailyStatusView: View {
    var interactor: DailyStatusBusinessLogic?

    @ObservedObject var viewModel = DailyStatusViewModel()

    var body: some View {
        if viewModel.isLoaded {
            GeometryReader { geo in
                VStack(spacing: 20) {
                    Spacer()

                    Text("理科")
                        .padding()
                        .padding(.leading, 32)
                        .font(.system(size: 28))
                        .frame(width: geo.size.width, height: 48, alignment: .leading)
                        .background(Color.science)
                        .foregroundColor(Color.white)

                    DailyStatus(target: viewModel.sciTarget, test: viewModel.sciTest, unlearn: viewModel.sciUnlearned, relearning: viewModel.sciRelearning)
                        .padding(.leading, 32)

                    Text("社会")
                        .padding()
                        .padding(.leading, 32)
                        .font(.system(size: 28))
                        .frame(width: geo.size.width, height: 48, alignment: .leading)
                        .background(Color.society)
                        .foregroundColor(Color.white)

                    DailyStatus(target: viewModel.socTarget, test: viewModel.socTest, unlearn: viewModel.socUnlearned, relearning: viewModel.socRelearning)
                        .padding(.leading, 32)

                    Text("国語")
                        .padding()
                        .padding(.leading, 32)
                        .font(.system(size: 28))
                        .frame(width: geo.size.width, height: 48, alignment: .leading)
                        .background(Color.language)
                        .foregroundColor(Color.white)

                    DailyStatus(target: viewModel.lanTarget, test: viewModel.lanTest, unlearn: viewModel.lanUnlearned, relearning: viewModel.lanRelearning)
                        .padding(.leading, 32)

                    Spacer()
                }
            }
            .onDisappear {
                viewModel.isLoaded = false
            }
        } else {
            Text("Loading...")
                .onAppear {
                    interactor?.load()
                }
        }
    }
}

extension DailyStatusView: DailyStatusDisplayLogic {
    func showTasks(model: DailyStatusViewModel) {
        viewModel.lanTarget = model.lanTarget
        viewModel.lanTest = model.lanTest
        viewModel.lanUnlearned = model.lanUnlearned
        viewModel.lanRelearning = model.lanRelearning

        viewModel.sciTarget = model.sciTarget
        viewModel.sciTest = model.sciTest
        viewModel.sciUnlearned = model.sciUnlearned
        viewModel.sciRelearning = model.sciRelearning

        viewModel.socTarget = model.socTarget
        viewModel.socTest = model.socTest
        viewModel.socUnlearned = model.socUnlearned
        viewModel.socRelearning = model.socRelearning

        viewModel.isLoaded = true
    }
}

extension DailyStatusView {
    func configureView() -> some View {
        var view = self
        let interactor = DailyStatusInteractor()
        let presenter = DailyStatusPresenter()

        view.interactor = interactor
        interactor.presenter = presenter
        presenter.view = view

        return view
    }
}

struct ChartsView_Previews: PreviewProvider {
    static var previews: some View {
        DailyStatusView()
            .previewInterfaceOrientation(.landscapeLeft)
    }
}
